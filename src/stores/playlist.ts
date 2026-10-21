import { defineStore } from "pinia";
import { ref } from "vue";
import type { Song } from "@/types";

export const usePlaylistStore = defineStore("playlist", () => {
  const playlist = ref<Song[]>([]);
  const setPlaylist = (items: Song[]) => (playlist.value = items);

  return { playlist, setPlaylist };
});
