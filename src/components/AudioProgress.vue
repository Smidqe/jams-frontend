<script setup lang="ts">
import { computed } from "vue";
import { Progress } from "@/components/ui/progress";

//both in seconds
const props = defineProps<{
  elapsed: number;
  duration: number;
}>();

const progress = computed(() =>
  props.duration > 0 ? Math.min((props.elapsed / props.duration) * 100, 100) : 0,
);

const formatTime = (s: number) => {
  const parts = [Math.floor(s / 60 / 60), Math.floor((s / 60) % 60), Math.floor(s % 60)];

  //ignore hours if not present, songs are usually in minutes
  //but allow it if present
  if (parts[0] === 0) {
    parts.shift();
  }

  return parts.map((p) => String(p).padStart(2, "0")).join(":");
};
</script>

<template>
  <div class="text-xs flex flex-row items-center gap-2">
    <template v-if="duration > 0">
      <span>{{ formatTime(Math.min(elapsed, duration)) }}</span>
      <span>/</span>
      <span>{{ formatTime(duration) }}</span>
    </template>
    <Progress :model-value="progress" class="h-1" />
  </div>
</template>
