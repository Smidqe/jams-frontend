//keys are uppercase (TITLE, ARTIST, ALBUM, ...)
export type Tags = Partial<Record<string, string>>;

export type Song = {
  id: string;
  durationMs: number;
  tags: Tags;
};

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
