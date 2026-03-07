<script setup lang="ts">
import { useStore } from "@/stores/counter";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";

const store = useStore();
const { current } = storeToRefs(store);

const url = ref("");

watch(
  current,
  () => (url.value = `${import.meta.env.VITE_JAMS_URL}/artwork?id=${current?.value?.id}`),
);
</script>
<template>
  <img v-if="current" :src="url" class="rounded-2xl object-contain" />
</template>
