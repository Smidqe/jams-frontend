import { defineStore } from "pinia";
import { ref } from "vue";

export const useSessionStore = defineStore(
  "session",
  () => {
    const timestamp = ref<string>("");
    const volume = ref<number>(10);

    const setTimestamp = (song_id: string, ts: number) => (timestamp.value = `${song_id}_${ts}`);
    const setVolume = (vol: number) => (volume.value = vol);

    return { timestamp, volume, setTimestamp, setVolume };
  },
  {
    persist: true,
  },
);
