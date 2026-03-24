<script setup lang="ts">
import { Progress } from "@/components/ui/progress";
import { useSessionStore } from "@/stores/session";
import { useInterval } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";

const { current_timestamp, current_song } = storeToRefs(useSessionStore());

const progress = ref(0);
const timestamp = ref(0);

const { reset } = useInterval(1000, {
  callback: () => {
    timestamp.value += 1;

    if (current_song.value) {
      progress.value = Math.min((timestamp.value / current_song.value?.duration) * 100, 100);
    }
  },
  controls: true,
});

watch(current_timestamp, () => {
  const diff = Math.abs(current_timestamp.value - timestamp.value);

  if (diff > 5) {
    timestamp.value = current_timestamp.value;
  }
});

watch(current_song, () => {
  reset();
});

const formatTime = (s: number) => {
  if (s === undefined) {
    return "00:00";
  }

  const parts = [Math.floor(s / 60 / 60), Math.floor((s / 60) % 60), Math.floor(s % 60)];

  //ignore hourse if not present, songs are usually in minutes
  //but allow it if present
  if (parts[0] === 0) {
    parts.shift();
  }

  return parts.join(":").replace(/\b(\d)\b/g, "0$1");
};
</script>

<template>
  <div class="text-xs flex flex-row items-center gap-2">
    <span>{{ formatTime(timestamp) }}</span>
    <span>/</span>
    <span v-if="current_song">{{ formatTime(current_song.duration) }}</span>
    <Progress v-model="progress" class="h-1" />
  </div>
</template>
