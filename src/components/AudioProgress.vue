<script setup lang="ts">
import { Progress } from "@/components/ui/progress";
import { useStore } from "@/stores/counter";
import { useInterval } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";

const store = useStore();
const { timestamp: sync, current } = storeToRefs(store);

const progress = ref(0);
const timestamp = ref(0);

const { reset } = useInterval(1000, {
  callback: () => {
    timestamp.value += 1;

    if (current.value) {
      progress.value = Math.min((timestamp.value / current.value?.duration) * 100, 100);
    }
  },
  controls: true,
});

watch(sync, () => {
  const diff = Math.abs(sync.value - timestamp.value);

  if (diff > 5) {
    timestamp.value = sync.value;
  }
});

watch(current, () => {
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
    <span v-if="current">{{ formatTime(current.duration) }}</span>
    <Progress v-model="progress" class="h-1" />
  </div>
</template>
