<script setup lang="ts">
import AudioPlayer from "./components/AudioPlayer.vue";
import ConnectionStatus from "./components/ConnectionStatus.vue";
import SongArtwork from "./components/SongArtwork.vue";
import { useJamSocket } from "./composables/useJamSocket";

useJamSocket();
</script>

<template>
  <!-- h-dvh: 100vh on phones includes the space behind the browser's address bar -->
  <div class="flex h-dvh flex-col items-center gap-2">
    <ConnectionStatus />
    <!-- artwork takes the space that's left (min-h-0 lets it shrink), player keeps its own height at the bottom -->
    <SongArtwork class="min-h-0 w-full flex-1" />
    <AudioPlayer class="mt-auto w-full" />
  </div>
</template>
