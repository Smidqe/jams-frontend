import { describe, expect, it } from "vitest";
import type { Position } from "@/types";
import { expectedPosition, latency, MAX_LATENCY_MS, shouldSeek } from "./sync";

const position = (overrides: Partial<Position> = {}): Position => ({
  songId: "song",
  positionMs: 40_000,
  serverTimeMs: 1_000_000,
  receivedAt: 1_000_000,
  ...overrides,
});

describe("latency", () => {
  it("is the time between the server building the message and receiving it", () => {
    expect(latency(position({ receivedAt: 1_000_150 }))).toBe(150);
  });

  it("is ignored when the local clock is behind the server", () => {
    expect(latency(position({ receivedAt: 999_000 }))).toBe(0);
  });

  it("is ignored when it's too large to be real", () => {
    expect(latency(position({ receivedAt: 1_000_000 + MAX_LATENCY_MS }))).toBe(0);
  });
});

describe("expectedPosition", () => {
  it("is the reported position right when it arrives", () => {
    expect(expectedPosition(position(), 1_000_000)).toBe(40);
  });

  it("adds latency and time passed since arrival", () => {
    const pos = position({ receivedAt: 1_000_200 });
    expect(expectedPosition(pos, 1_002_200)).toBeCloseTo(42.2);
  });

  it("still counts local time when the clocks are out of sync", () => {
    //server clock an hour ahead, latency is ignored but elapsed time isn't
    const pos = position({ serverTimeMs: 1_000_000 + 3_600_000 });
    expect(expectedPosition(pos, 1_030_000)).toBe(70);
  });

  it("never goes backwards if `now` is before arrival", () => {
    expect(expectedPosition(position(), 999_000)).toBe(40);
  });
});

describe("shouldSeek", () => {
  it("ignores small drift", () => {
    expect(shouldSeek(40, 44)).toBe(false);
    expect(shouldSeek(44, 40)).toBe(false);
  });

  it("seeks when drift is too large either way", () => {
    expect(shouldSeek(0, 40)).toBe(true);
    expect(shouldSeek(50, 40)).toBe(true);
  });
});
