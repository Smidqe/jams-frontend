<script setup lang="ts">
import { useTitle } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import AudioPlayer from "./components/AudioPlayer.vue";
import ConnectionStatus from "./components/ConnectionStatus.vue";
import SongArtwork from "./components/SongArtwork.vue";
import { useJamSocket } from "./composables/useJamSocket";
import { useSessionStore } from "./stores/session";

useJamSocket();

const { currentSong } = storeToRefs(useSessionStore());

//"Title – Artist · Jams" while a song plays, just "Jams" without one
useTitle(
  computed(() => {
    const { TITLE, ARTIST } = currentSong.value?.tags ?? {};
    const song = [TITLE, ARTIST].filter(Boolean).join(" – ");
    return song ? `${song} · Jams` : "Jams";
  }),
);
</script>

<template>
  <div class="flex h-dvh flex-col items-center gap-2">
    <ConnectionStatus />
    <SongArtwork class="min-h-0 w-full flex-1" />
    <AudioPlayer class="mt-auto w-full" />
  </div>
</template>
