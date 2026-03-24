import { defineStore } from "pinia";
import { ref } from "vue";

export const useSettingsStore = defineStore(
  "settings",
  () => {
    const volume = ref<number>(10);
    const setVolume = (vol: number) => (volume.value = vol);

    return { volume, setVolume };
  },
  {
    persist: true,
  },
);
