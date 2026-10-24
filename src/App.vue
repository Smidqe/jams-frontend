<script setup lang="ts">
import AudioPlayer from "./components/AudioPlayer.vue";
import ConnectionStatus from "./components/ConnectionStatus.vue";
import SongArtwork from "./components/SongArtwork.vue";
import { useJamSocket } from "./composables/useJamSocket";

useJamSocket();
</script>

<template>
  <div class="flex h-dvh flex-col items-center gap-2">
    <ConnectionStatus />
    <SongArtwork class="min-h-0 w-full flex-1" />
    <AudioPlayer class="mt-auto w-full" />
  </div>
</template>
