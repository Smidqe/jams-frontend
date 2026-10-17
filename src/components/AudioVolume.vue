<script setup lang="ts">
import { Volume, Volume1, Volume2 } from "lucide-vue-next";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "./ui/slider";

const volume = defineModel<number>({ required: true });
const sliderValue = computed({
  get: () => [volume.value],
  set: ([value]) => (volume.value = value ?? volume.value),
});
</script>
<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button size="icon" variant="outline">
        <Volume v-if="volume === 0" />
        <Volume1 v-else-if="volume <= 50" />
        <Volume2 v-else />
        <span class="sr-only">Volume</span>
      </Button>
    </PopoverTrigger>
    <PopoverContent>
      <Slider v-model="sliderValue" :max="100" :step="1" :min="0" />
    </PopoverContent>
  </Popover>
</template>
