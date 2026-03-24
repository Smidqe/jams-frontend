<script setup lang="ts">
import { useSessionStore } from "@/stores/session";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";

const { current_song } = storeToRefs(useSessionStore());
const url = ref("");

watch(
  current_song,
  () => (url.value = `${import.meta.env.VITE_JAMS_URL}/artwork?id=${current_song?.value?.id}`),
);
</script>
<template>
  <img v-if="current_song" :src="url" class="rounded-2xl object-contain" />
</template>
