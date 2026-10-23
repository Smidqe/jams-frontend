<script setup lang="ts">
import { storeToRefs } from "pinia";
import { artworkUrl } from "@/lib/api";
import { useSessionStore } from "@/stores/session";

const { currentSong } = storeToRefs(useSessionStore());
</script>
<template>
  <img
    v-if="currentSong"
    :src="artworkUrl(currentSong.id)"
    :alt="currentSong.tags.ALBUM ?? 'Album artwork'"
    class="object-contain"
  />
</template>
