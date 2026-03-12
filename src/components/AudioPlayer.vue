<script setup lang="ts">
import { useStore } from "@/stores/counter";
import type { Song } from "@/types";
import { Howl } from "howler";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { Card } from "@/components/ui/card";
import AudioVolume from "./AudioVolume.vue";
import AudioProgress from "./AudioProgress.vue";
import SongInfo from "./SongInfo.vue";
import { useSessionStore } from "@/stores/session";

const store = useStore();
const { current, timestamp } = storeToRefs(store);

const session = useSessionStore();
const { timestamp: stored_timestamp, volume: stored_volume } = storeToRefs(session);

const volume = ref([stored_volume.value]);
const player = ref<Howl | null>(null);

watch(current, (song: Song | null) => {
  player.value?.unload();
  player.value = new Howl({
    src: [`${import.meta.env.VITE_JAMS_URL}/stream?id=${song?.id}`],
    format: ["ogg"],
    volume: stored_volume.value / 100,
    html5: true,
    autoplay: true,
    preload: "metadata",

    onloaderror: (id, err) => console.error(id, err),
    onplayerror: (id, err) => console.error(id, err),

    onplay: () => {
      if (stored_timestamp.value?.startsWith(current.value?.id ?? "")) {
        player.value?.seek(Number.parseInt(stored_timestamp.value.split("_")[1] ?? "0"));
      }
    },
  });
});

watch(timestamp, () => {
  if (player.value === null) {
    return;
  }

  const now = player.value.seek();

  if (now && Math.abs(now - timestamp.value) > 5) {
    player.value.seek(timestamp.value);
    session.setTimestamp(current.value?.id ?? "", timestamp.value);
  }
});

watch(volume, () => {
  player?.value?.volume(volume.value[0]! / 100);
  session.setVolume(volume.value[0]!);
});
</script>
<template>
  <Card class="p-0 py-1 px-2 rounded-none gap-1">
    <AudioProgress />
    <div class="flex flex-row justify-between items-center">
      <SongInfo v-if="current" :tags="current.tags" />
      <div>
        <AudioVolume v-model="volume" />
        <AudioVolume />
      </div>
    </div>
  </Card>
</template>
