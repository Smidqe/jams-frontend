<script setup lang="ts">
import { Slider } from "./ui/slider";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useSettingsStore } from "@/stores/settings";
import { Volume, Volume1, Volume2 } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";

const settings = useSettingsStore();
const { volume } = storeToRefs(settings);

const model = ref<number[]>([volume.value]);

console.log(model);

watch(model, () => settings.setVolume(model.value[0]));
</script>
<template>
  <Popover>
    <PopoverTrigger>
      <Button size="icon" variant="outline">
        <Volume v-if="volume === 0" />
        <Volume1 v-if="volume > 0 && volume <= 50" />
        <Volume2 v-if="volume > 50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent>
      <Slider v-model="model" :max="100" :step="1" :min="0" />
    </PopoverContent>
  </Popover>
</template>
