import type { Song } from "@/types";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useSessionStore = defineStore("session", () => {
  const session_id = ref<string | null>(null);

  //song related
  const current_song = ref<Song | null>(null);
  const current_timestamp = ref<number>(0);

  //setters
  const setSessionId = (id: string) => (session_id.value = id);
  const setSong = (song: Song) => (current_song.value = song);
  const setTimestamp = (ts: number) => (current_timestamp.value = ts);

  return { session_id, current_song, current_timestamp, setSessionId, setSong, setTimestamp };
});
