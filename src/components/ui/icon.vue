<script setup lang="ts">
import * as icons from "lucide-vue-next";
import { computed } from "vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  size: Number,
  color: String,
  strokeWidth: Number,
  defaultClass: String,
});

// @ts-expect-error
// biome-ignore lint/correctness/noUnusedVariables: Biome doesn't understand vue properly yet :/
// biome-ignore lint/performance/noDynamicNamespaceImportAccess: Boo
const icon = computed(() => icons[props.name]);
</script>

<template>
  <component
    :is="icon"
    :size="size"
    :color="color"
    :stroke-width="strokeWidth"
    :default-class="defaultClass"
  />
</template>
