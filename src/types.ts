//keys are uppercase (TITLE, ARTIST, ALBUM, ...), any of them can be missing
export type Tags = Partial<Record<string, string>>;

export type Song = {
  id: string;
  durationMs: number;
  tags: Tags;
};

//where a song was on the server at serverTimeMs, receivedAt is the local Date.now() on arrival
export type Position = {
  songId: string;
  positionMs: number;
  serverTimeMs: number;
  receivedAt: number;
};

export type JamEvent =
  | { kind: "SessionId"; sessionId: string }
  | { kind: "Song"; song: Song; position: Position }
  | { kind: "Sync"; position: Position };
