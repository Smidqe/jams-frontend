<script setup lang="ts">
import Icon from "./icon.vue";

type Props = {
  icon: string;
  label: string;
  size?: number;
};

const props = defineProps<Props>();
</script>

<template>
  <div class="flex items-center gap-1">
    <Icon :name="props.icon" :size="props.size" />
    <span> {{ label }}</span>
  </div>
</template>
