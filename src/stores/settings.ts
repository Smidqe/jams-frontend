import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed } from "vue";
import { isNumber } from "@/lib/utils";

const DEFAULT_VOLUME = 10;
const clampVolume = (v: unknown) => (isNumber(v) ? Math.min(Math.max(v, 0), 100) : DEFAULT_VOLUME);

export const useSettingsStore = defineStore("settings", () => {
  const stored = useLocalStorage("settings", { volume: DEFAULT_VOLUME }, { mergeDefaults: true });
  const volume = computed({
    get: () => clampVolume(stored.value.volume),
    set: (v: number) => (stored.value = { ...stored.value, volume: clampVolume(v) }),
  });

  return { volume };
});
