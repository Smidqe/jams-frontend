export type SocketMessage = {
  kind: "Song" | "Sync";
  payload: Song | number;
};

export type Song = {
  duration: number;
  id: string;
  tags: Tags;
};

export type Tags = {
  artist: string;
  album: string;
  title: string;
};
