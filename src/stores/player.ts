import { useEventListener, useMediaControls } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, ref, shallowRef, watch } from "vue";
import { streamUrl } from "@/lib/api";
import { expectedPosition, shouldSeek } from "@/lib/sync";
import { useSessionStore } from "./session";
import { useSettingsStore } from "./settings";

export type PlayerStatus = "idle" | "loading" | "blocked" | "playing" | "error";

//owns the audio element, plays whatever the session says and keeps it in sync with the server
export const usePlayerStore = defineStore("player", () => {
  const session = useSessionStore();
  const settings = useSettingsStore();

  const audio = shallowRef(new Audio());
  audio.value.preload = "metadata";

  const { currentTime, playing, volume } = useMediaControls(audio);

  //autoplay was refused by the browser, needs a click to start
  const blocked = ref(false);
  const failed = ref(false);

  const status = computed<PlayerStatus>(() => {
    if (!session.currentSong) return "idle";
    if (failed.value) return "error";
    if (blocked.value) return "blocked";
    return playing.value ? "playing" : "loading";
  });

  const sync = () => {
    const el = audio.value;

    if (!session.position || el.readyState < HTMLMediaElement.HAVE_METADATA) {
      return;
    }

    const expected = expectedPosition(session.position, Date.now());

    if (shouldSeek(el.currentTime, expected)) {
      el.currentTime = expected;
    }
  };

  const play = async () => {
    try {
      await audio.value.play();
      blocked.value = false;
    } catch (err) {
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        blocked.value = true;
      } else if (!(err instanceof DOMException && err.name === "AbortError")) {
        //AbortError just means the source changed before playback started
        console.error("playback failed", err);
        failed.value = true;
      }
    }
  };

  //a new session id (after a reconnect) needs a new stream too
  watch(
    () => [session.currentSong?.id, session.sessionId] as const,
    ([id, sid]) => {
      const el = audio.value;
      blocked.value = false;
      failed.value = false;

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
  useEventListener(audio, "playing", sync);
  useEventListener(audio, "error", () => {
    console.error("audio error", audio.value.error);
    failed.value = true;
  });

  watch(
    () => settings.volume,
    (vol) => (volume.value = vol / 100),
    { immediate: true },
  );

  return { status, elapsed: currentTime, play };
});
