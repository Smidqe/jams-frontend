<script setup lang="ts">
import AudioPlayer from "./components/AudioPlayer.vue";
import ConnectionStatus from "./components/ConnectionStatus.vue";
import ModeToggle from "./components/ModeToggle.vue";
import SongArtwork from "./components/SongArtwork.vue";
import { useJamSocket } from "./composables/useJamSocket";

useJamSocket();
</script>

<template>
  <div class="flex flex-col items-center gap-2 h-screen">
    <div class="flex items-center gap-2">
      <ConnectionStatus />
      <ModeToggle />
    </div>
    <SongArtwork class="h-full" />
    <AudioPlayer class="w-full flex-1" />
  </div>
</template>
