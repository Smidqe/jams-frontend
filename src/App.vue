<script setup lang="ts">
import { useWebSocket } from "@vueuse/core";
import AudioPlayer from "./components/AudioPlayer.vue";
import type { SocketMessage, Song } from "./types";
import SongArtwork from "./components/SongArtwork.vue";
import ModeToggle from "./components/ModeToggle.vue";
import { useSessionStore } from "./stores/session";

const { setSong, setTimestamp, setSessionId } = useSessionStore();
const handlers = new Map<string, (arg: SocketMessage) => void>([
  ["Song", (arg) => setSong(arg.payload as Song)],
  ["Sync", (arg) => setTimestamp(arg.payload as number)],
  ["SessionId", (arg) => setSessionId(arg.payload as string)],
]);

const ws = useWebSocket(`${import.meta.env.VITE_JAMS_URL}/ws`, {
  autoConnect: false,
  immediate: true,
  onDisconnected: (_ws, ev) => {
    //it should never close, but it does for whatever fucking reason
    console.error(ev);

    //just reopen that hole, bastard
    ws.open();
  },
  onError: (_ws, ev) => {
    console.error(ev);
    ws.open();
  },
  onMessage: (_ws, msg) => {
    const data = JSON.parse(msg.data) as SocketMessage;
    const handler = handlers.get(data.kind);

    if (handler) {
      handler(data);
    }
  },
});
</script>

<template>
  <div class="flex flex-col items-center gap-2 h-screen">
    <ModeToggle class="justify-end" />
    <SongArtwork class="w-flex-1 h-full" />
    <AudioPlayer class="w-full flex-1" />
  </div>
</template>
