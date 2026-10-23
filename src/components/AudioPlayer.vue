<script setup lang="ts">
import { Info, ListMusic, Play, RotateCcw } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { usePlayerStore } from "@/stores/player";
import { useSessionStore } from "@/stores/session";
import { useSettingsStore } from "@/stores/settings";
import AudioProgress from "./AudioProgress.vue";
import AudioVolume from "./AudioVolume.vue";
import ModeToggle from "./ModeToggle.vue";
import SongInfo from "./SongInfo.vue";

const player = usePlayerStore();
const { volume } = storeToRefs(useSettingsStore());
const { currentSong } = storeToRefs(useSessionStore());
const { status, elapsed } = storeToRefs(player);

const duration = computed(() => (currentSong.value?.durationMs ?? 0) / 1000);
</script>
<template>
  <div
    class="flex flex-wrap items-center justify-end gap-1 border bg-card px-2 py-1"
  >
    <AudioProgress :elapsed="elapsed" :duration="duration" class="basis-full" />
    <SongInfo v-if="currentSong" :tags="currentSong.tags" class="min-w-0 flex-1" />
    <button
      v-if="status === 'blocked' || status === 'paused'"
      type="button"
      class="icon-button-primary"
      :aria-label="status === 'blocked' ? 'Start playback' : 'Resume playback'"
      :title="status === 'blocked' ? 'Start playback' : 'Resume playback'"
      @click="player.play()"
    >
      <Play />
    </button>
    <button
      v-else-if="status === 'error'"
      type="button"
      class="icon-button-primary"
      aria-label="Playback failed, retry"
      title="Playback failed, retry"
      @click="player.retry()"
    >
      <RotateCcw />
    </button>
    <!-- placeholders, disabled until song metadata and playlist exist -->
    <button type="button" class="icon-button" aria-label="Song info (coming soon)" disabled>
      <Info />
    </button>
    <button type="button" class="icon-button" aria-label="Playlist (coming soon)" disabled>
      <ListMusic />
    </button>
    <ModeToggle />
    <AudioVolume v-model="volume" />
  </div>
</template>
