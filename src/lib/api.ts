import type { JamEvent, Position, Tags } from "@/types";

export const wsUrl = () => {
  const url = new URL("/ws", window.location.href);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  return url.toString();
};

export const streamUrl = (id: string, sid: string) => `/stream?${new URLSearchParams({ id, sid })}`;
export const artworkUrl = (id: string) => `/artwork?${new URLSearchParams({ id })}`;

type Obj = Record<string, unknown>;

const isObject = (v: unknown): v is Obj => typeof v === "object" && v !== null;
const isString = (v: unknown): v is string => typeof v === "string";
const isNumber = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

const parseTags = (v: unknown): Tags =>
  isObject(v)
    ? Object.fromEntries(
        Object.entries(v).filter((entry): entry is [string, string] => isString(entry[1])),
      )
    : {};

const parsePosition = (v: unknown, now: number): Position | null => {
  if (!isObject(v) || !isString(v.id) || !isNumber(v.position_ms) || !isNumber(v.server_time_ms)) {
    return null;
  }

  return {
    songId: v.id,
    positionMs: v.position_ms,
    serverTimeMs: v.server_time_ms,
    receivedAt: now,
  };
};

export const parseMessage = (raw: string, now = Date.now()): JamEvent | null => {
  let data: unknown;

  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!isObject(data)) {
    return null;
  }

  const { kind, payload } = data;

  switch (kind) {
    case "SessionId":
      return isString(payload) ? { kind, sessionId: payload } : null;
    case "Song": {
      const position = parsePosition(payload, now);

      if (!position || !isObject(payload) || !isNumber(payload.duration_ms)) {
        return null;
      }

      const song = {
        id: position.songId,
        durationMs: payload.duration_ms,
        tags: parseTags(payload.tags),
      };
      return { kind, song, position };
    }
    case "Sync": {
      const position = parsePosition(payload, now);
      return position ? { kind, position } : null;
    }
    default:
      return null;
  }
};
