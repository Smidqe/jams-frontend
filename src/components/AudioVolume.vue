<script setup lang="ts">
import { Volume, Volume1, Volume2 } from "lucide-vue-next";

//0-100
const volume = defineModel<number>({ required: true });
</script>
<template>
  <!-- no wrapper, the icon and slider sit directly in the player's row -->
  <Volume v-if="volume === 0" class="size-4 shrink-0" />
  <Volume1 v-else-if="volume <= 50" class="size-4 shrink-0" />
  <Volume2 v-else class="size-4 shrink-0" />
  <!-- native range, keyboard and screen reader support come built in -->
  <input
    v-model.number="volume"
    type="range"
    min="0"
    max="100"
    step="1"
    aria-label="Volume"
    class="w-24 cursor-pointer accent-primary"
  />
</template>
