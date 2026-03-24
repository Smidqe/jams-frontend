<script setup lang="ts">
import type { Song } from "@/types";
import { Howl } from "howler";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { Card } from "@/components/ui/card";
import AudioVolume from "./AudioVolume.vue";
import AudioProgress from "./AudioProgress.vue";
import SongInfo from "./SongInfo.vue";
import { useSessionStore } from "@/stores/session";
import { useSettingsStore } from "@/stores/settings";

const settings = useSettingsStore();
const session = useSessionStore();

const { volume } = storeToRefs(settings);
const { current_song, current_timestamp, session_id } = storeToRefs(session);

const player = ref<Howl | null>(null);

watch(current_song, (song: Song | null) => {
  player.value?.unload();
  player.value = new Howl({
    src: [`${import.meta.env.VITE_JAMS_URL}/stream?id=${song?.id}&sid=${session_id.value}`],
    format: ["ogg"],
    volume: volume.value / 100,
    html5: true,
    autoplay: true,
    preload: "metadata",
    onloaderror: (id, err) => console.error(id, err),
    onplayerror: (id, err) => console.error(id, err),
  });
});

watch(current_timestamp, () => {
  if (!player.value) {
    return;
  }

  if (Math.abs(player.value.seek() - current_timestamp.value) > 5) {
    player.value.seek(current_timestamp.value);
  }
});

watch(volume, () => {
  player.value?.volume(volume.value / 100);
});
</script>
<template>
  <Card class="p-0 py-1 px-2 rounded-none gap-1">
    <AudioProgress />
    <div class="flex flex-row justify-between items-center">
      <SongInfo v-if="current_song" :tags="current_song.tags" />
      <div>
        <AudioVolume v-model="volume" />
        <AudioVolume />
      </div>
    </div>
  </Card>
</template>
