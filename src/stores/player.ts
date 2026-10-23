import { useEventListener, useMediaControls } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { streamUrl } from "@/lib/api";
import { expectedPosition, shouldSeek } from "@/lib/sync";
import { useSessionStore } from "./session";
import { useSettingsStore } from "./settings";

export type PlayerStatus = "idle" | "loading" | "blocked" | "paused" | "playing" | "error";

//a failing stream is reloaded after 1s, 2s and 4s before giving up
const MAX_RETRIES = 3;
const RETRY_BASE_MS = 1000;

//owns the audio element, plays whatever the session says and keeps it in sync with the server
export const usePlayerStore = defineStore("player", () => {
  const session = useSessionStore();
  const settings = useSettingsStore();

  const audio = new Audio();
  audio.preload = "metadata";

  const { currentTime, playing, ended, volume } = useMediaControls(audio);

  //autoplay was refused by the browser, needs a click to start
  const blocked = ref(false);
  const failed = ref(false);
  //audio.paused isn't reactive, mirrored from the play/pause events
  const paused = ref(true);
  //waiting for an automatic retry, shown as loading rather than paused
  const retrying = ref(false);

  let retries = 0;
  let retryTimer: ReturnType<typeof setTimeout> | undefined;

  const status = computed<PlayerStatus>(() => {
    if (!session.currentSong) return "idle";
    if (failed.value) return "error";
    if (blocked.value) return "blocked";
    if (playing.value) return "playing";
    if (retrying.value) return "loading";
    //paused by the user (media keys, browser controls), but not at the end of a song,
    //the next Song message starts the new one
    if (paused.value && !ended.value) return "paused";
    return "loading";
  });

  const sync = () => {
    const el = audio;

    if (!session.position || el.readyState < HTMLMediaElement.HAVE_METADATA) {
      return;
    }

    const expected = expectedPosition(session.position, Date.now());

    if (shouldSeek(el.currentTime, expected)) {
      el.currentTime = expected;
    }
  };

  const reload = () => {
    if (!audio.src) {
      return;
    }

    audio.load();
    play();
  };

  const fail = (reason: string, err: unknown) => {
    if (retries < MAX_RETRIES) {
      const delay = RETRY_BASE_MS * 2 ** retries;
      retries++;
      console.warn(`${reason}, retrying in ${delay}ms (${retries}/${MAX_RETRIES})`, err);
      retrying.value = true;
      retryTimer = setTimeout(reload, delay);
      return;
    }

    console.error(`${reason}, giving up`, err);
    retrying.value = false;
    failed.value = true;
  };

  //forget retries and errors, used when the source changes or the user retries manually
  const resetRetries = () => {
    clearTimeout(retryTimer);
    retries = 0;
    retrying.value = false;
    failed.value = false;
  };

  async function play() {
    try {
      await audio.play();
      blocked.value = false;
    } catch (err) {
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        blocked.value = true;
      } else if (err instanceof DOMException && err.name === "AbortError") {
        //the source changed before playback started, nothing to do
      } else if (!audio.error) {
        //media errors also fire the "error" event below, only count them once
        fail("playback failed", err);
      }
    }
  }

  //manual retry from the UI after the automatic ones ran out
  const retry = () => {
    resetRetries();
    reload();
  };

  //a new session id (after a reconnect) needs a new stream too
  watch(
    () => [session.currentSong?.id, session.sessionId] as const,
    ([id, sid]) => {
      const el = audio;
      resetRetries();
      blocked.value = false;

      if (!id || !sid) {
        el.removeAttribute("src");
        el.load();
        return;
      }

      el.src = streamUrl(id, sid);
      play();
    },
  );

  watch(() => session.position, sync);
  useEventListener(audio, ["play", "pause"], () => (paused.value = audio.paused));
  //resuming after a pause (or a retry) also jumps back to where the jam is
  useEventListener(audio, "playing", () => {
    retries = 0;
    retrying.value = false;
    sync();
  });
  useEventListener(audio, "error", () => fail("audio error", audio.error));

  watch(
    () => settings.volume,
    (vol) => (volume.value = vol / 100),
    { immediate: true },
  );

  return { status, elapsed: computed(() => currentTime.value), play, retry };
});
