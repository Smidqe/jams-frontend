import type { JamEvent, Position, Tags } from "@/types";
import { isNumber, isObject, isString } from "./utils";

//backend lives under api/ next to the app (BASE_URL is "./" in builds), e.g. /jams/api/ws in production.
//the server's nginx routes /jams/api/ to the backend, locally the vite proxy or the image's nginx does it
const API = `${import.meta.env.BASE_URL}api/`;

export const wsUrl = () => {
  const url = new URL(`${API}ws`, window.location.href);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  return url.toString();
};

export const streamUrl = (id: string, sid: string) =>
  `${API}stream?${new URLSearchParams({ id, sid })}`;
export const artworkUrl = (id: string) => `${API}artwork?${new URLSearchParams({ id })}`;

const parseTags = (v: unknown): Tags => {
  if (!isObject(v)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(v).filter((entry): entry is [string, string] => isString(entry[1])),
  );
};

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

  //fucked up response
  if (!isObject(data)) {
    console.warn("[api]: Response was not an object", data);
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
