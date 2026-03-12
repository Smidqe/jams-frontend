<script setup lang="ts">
import { useIntervalFn, useWebSocket } from "@vueuse/core";
import AudioPlayer from "./components/AudioPlayer.vue";
import { useStore } from "./stores/counter";
import type { SocketMessage, Song } from "./types";
import SongArtwork from "./components/SongArtwork.vue";
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import ModeToggle from "./components/ModeToggle.vue";

const connected = ref(false);

const { setSong, setTimestamp } = useStore();
const handlers = new Map<string, (arg: SocketMessage) => void>([
  ["Song", (arg) => setSong(arg.payload as Song)],
  ["Sync", (arg) => setTimestamp(arg.payload as number)],
]);

const { status, open, close } = useWebSocket(`${import.meta.env.VITE_JAMS_URL}/ws`, {
  autoConnect: false,
  immediate: false,
  onConnected: (ws) => {
    console.log("connected");
    connected.value = true;
  },
  onMessage: (ws, msg) => {
    console.log(msg);

    const data = JSON.parse(msg.data) as SocketMessage;
    const handler = handlers.get(data.kind);

    if (handler) {
      handler(data);
    }
  },
});
</script>

<template>
  <div v-if="!connected">
    <Button label="Connect" @click="open" />
  </div>
  <div v-else class="flex flex-col items-center gap-2 h-screen">
    <ModeToggle class="justify-end" />
    <SongArtwork class="w-flex-1 h-full" />
    <AudioPlayer class="w-full flex-1" />
  </div>
</template>
