import { describe, expect, it } from "vitest";
import { parseMessage } from "./api";

const NOW = 1_792_240_151_000;

describe("parseMessage", () => {
  it("parses SessionId", () => {
    const raw = JSON.stringify({ kind: "SessionId", payload: "V1StGXR8_Z5jdHi6B-myT" });
    expect(parseMessage(raw, NOW)).toEqual({
      kind: "SessionId",
      sessionId: "V1StGXR8_Z5jdHi6B-myT",
    });
  });

  it("parses Song", () => {
    const raw = JSON.stringify({
      kind: "Song",
      payload: {
        id: "abc",
        duration_ms: 142091,
        tags: { TITLE: "Pony I Want To Be", ARTIST: "Matt Kunes", TRACKNUMBER: "1" },
        position_ms: 0,
        server_time_ms: 1792240150927,
      },
    });

    expect(parseMessage(raw, NOW)).toEqual({
      kind: "Song",
      song: {
        id: "abc",
        durationMs: 142091,
        tags: { TITLE: "Pony I Want To Be", ARTIST: "Matt Kunes", TRACKNUMBER: "1" },
      },
      position: { songId: "abc", positionMs: 0, serverTimeMs: 1792240150927, receivedAt: NOW },
    });
  });

  it("drops non-string tags and handles missing tags", () => {
    const payload = { id: "abc", duration_ms: 1, position_ms: 0, server_time_ms: 0 };

    const withBadTags = parseMessage(
      JSON.stringify({ kind: "Song", payload: { ...payload, tags: { TITLE: "ok", DATE: 2015 } } }),
    );
    const withoutTags = parseMessage(JSON.stringify({ kind: "Song", payload }));

    expect(withBadTags?.kind === "Song" && withBadTags.song.tags).toEqual({ TITLE: "ok" });
    expect(withoutTags?.kind === "Song" && withoutTags.song.tags).toEqual({});
  });

  it("parses Sync", () => {
    const raw = JSON.stringify({
      kind: "Sync",
      payload: { id: "abc", position_ms: 40012, server_time_ms: 1792240190939 },
    });

    expect(parseMessage(raw, NOW)).toEqual({
      kind: "Sync",
      position: { songId: "abc", positionMs: 40012, serverTimeMs: 1792240190939, receivedAt: NOW },
    });
  });

  it.each([
    ["invalid json", "{"],
    ["not an object", "42"],
    ["unknown kind", JSON.stringify({ kind: "Nope", payload: null })],
    ["SessionId without a string", JSON.stringify({ kind: "SessionId", payload: 1 })],
    ["Sync as a plain number", JSON.stringify({ kind: "Sync", payload: 40 })],
    [
      "Song without duration",
      JSON.stringify({ kind: "Song", payload: { id: "a", position_ms: 0, server_time_ms: 0 } }),
    ],
  ])("rejects %s", (_, raw) => {
    expect(parseMessage(raw, NOW)).toBeNull();
  });
});
