import type { Song } from "@/types";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useStore = defineStore("counter", () => {
  const current = ref<Song | null>(null);
  const playlist = ref<Song[]>([]);
  const timestamp = ref<number>(0);

  const setSong = (song: Song) => (current.value = song);
  const setTimestamp = (ts: number) => (timestamp.value = ts);

  return { current, playlist, setSong, setTimestamp, timestamp };
});
