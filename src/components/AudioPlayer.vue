<script setup lang="ts">
import { Play } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePlayerStore } from "@/stores/player";
import { useSessionStore } from "@/stores/session";
import { useSettingsStore } from "@/stores/settings";
import AudioProgress from "./AudioProgress.vue";
import AudioVolume from "./AudioVolume.vue";
import SongInfo from "./SongInfo.vue";

const player = usePlayerStore();
const { volume } = storeToRefs(useSettingsStore());
const { currentSong } = storeToRefs(useSessionStore());
const { status, elapsed } = storeToRefs(player);

const duration = computed(() => (currentSong.value?.durationMs ?? 0) / 1000);
</script>
<template>
  <Card class="p-0 py-1 px-2 rounded-none gap-1">
    <AudioProgress :elapsed="elapsed" :duration="duration" />
    <div class="flex flex-row justify-between items-center">
      <SongInfo v-if="currentSong" :tags="currentSong.tags" />
      <div class="flex items-center gap-1">
        <Button v-if="status === 'blocked'" size="icon" @click="player.play()">
          <Play />
          <span class="sr-only">Start playback</span>
        </Button>
        <span v-else-if="status === 'error'" class="text-xs text-destructive">Playback failed</span>
        <AudioVolume v-model="volume" />
      </div>
    </div>
  </Card>
</template>
