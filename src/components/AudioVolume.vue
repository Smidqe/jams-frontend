<script setup lang="ts">
import { Volume, Volume1, Volume2 } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import AppPopover from "./AppPopover.vue";

//0-100
const volume = defineModel<number>({ required: true });
</script>
<template>
  <AppPopover placement="top-end" content-class="w-72">
    <template #trigger="trigger">
      <Button size="icon" variant="outline" v-bind="trigger">
        <Volume v-if="volume === 0" />
        <Volume1 v-else-if="volume <= 50" />
        <Volume2 v-else />
        <span class="sr-only">Volume</span>
      </Button>
    </template>
    <!-- native range instead of reka Slider, keyboard and screen reader support come built in -->
    <input
      v-model.number="volume"
      type="range"
      min="0"
      max="100"
      step="1"
      aria-label="Volume"
      class="block w-full cursor-pointer accent-primary"
    />
  </AppPopover>
</template>
