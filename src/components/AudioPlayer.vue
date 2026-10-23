<script setup lang="ts">
import { Info, ListMusic, Play } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { iconButton, iconButtonPrimary } from "@/lib/styles";
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
  <div class="flex flex-col gap-1 border bg-card px-2 py-1 text-card-foreground shadow-sm">
    <AudioProgress :elapsed="elapsed" :duration="duration" />
    <div class="flex flex-row justify-between items-center">
      <SongInfo v-if="currentSong" :tags="currentSong.tags" />
      <!-- ml-auto keeps the controls on the right before a song (and SongInfo) arrives -->
      <div class="ml-auto flex items-center gap-1">
        <button
          v-if="status === 'blocked'"
          type="button"
          :class="iconButtonPrimary"
          aria-label="Start playback"
          @click="player.play()"
        >
          <Play />
        </button>
        <span v-else-if="status === 'error'" class="text-xs text-destructive">Playback failed</span>
        <!-- placeholders, song metadata and playlist come later -->
        <button type="button" :class="iconButton" title="Song info" aria-label="Song info">
          <Info />
        </button>
        <button type="button" :class="iconButton" title="Playlist" aria-label="Playlist">
          <ListMusic />
        </button>
        <ModeToggle />
        <AudioVolume v-model="volume" />
      </div>
    </div>
  </div>
</template>
