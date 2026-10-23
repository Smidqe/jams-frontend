<script setup lang="ts">
import { Volume, Volume1, Volume2 } from "lucide-vue-next";

//0-100
const volume = defineModel<number>({ required: true });
</script>
<template>
  <label class="flex items-center gap-2">
    <Volume v-if="volume === 0" class="size-4" />
    <Volume1 v-else-if="volume <= 50" class="size-4" />
    <Volume2 v-else class="size-4" />
    <span class="sr-only">Volume</span>
    <!-- native range, keyboard and screen reader support come built in -->
    <input
      v-model.number="volume"
      type="range"
      min="0"
      max="100"
      step="1"
      class="w-24 cursor-pointer accent-primary"
    />
  </label>
</template>
