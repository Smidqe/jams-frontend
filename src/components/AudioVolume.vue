<script setup lang="ts">
import { Volume, Volume1, Volume2 } from "lucide-vue-next";

//0-100
const volume = defineModel<number>({ required: true });
</script>
<template>
  <Volume v-if="volume === 0" :size="16" />
  <Volume1 v-else-if="volume <= 50" :size="16" />
  <Volume2 v-else :size="16" />
  <input
    v-model.number="volume"
    type="range"
    min="0"
    max="100"
    step="1"
    aria-label="Volume"
    class="w-24 accent-primary"
  />
</template>
