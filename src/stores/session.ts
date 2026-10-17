import type { WebSocketStatus } from "@vueuse/core";
import { defineStore } from "pinia";
import { ref } from "vue";
import type { JamEvent, Position, Song } from "@/types";

export const useSessionStore = defineStore("session", () => {
  const sessionId = ref<string | null>(null);
  const connection = ref<WebSocketStatus>("CONNECTING");

  //song related
  const currentSong = ref<Song | null>(null);
  const position = ref<Position | null>(null);

  const setConnection = (status: WebSocketStatus) => (connection.value = status);

  const setPosition = (pos: Position) => {
    if (pos.songId !== currentSong.value?.id) {
      return;
    }

    position.value = pos;
  };

  //the same song is re-sent if we fall behind, only resync the position then
  const setSong = (song: Song, pos: Position) => {
    if (song.id !== currentSong.value?.id) {
      currentSong.value = song;
    }

    setPosition(pos);
  };

  const handleEvent = (event: JamEvent) => {
    switch (event.kind) {
      case "SessionId":
        sessionId.value = event.sessionId;
        break;
      case "Song":
        setSong(event.song, event.position);
        break;
      case "Sync":
        setPosition(event.position);
        break;
    }
  };

  return { sessionId, connection, currentSong, position, setConnection, handleEvent };
});
