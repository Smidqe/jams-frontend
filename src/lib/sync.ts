import type { Position } from "@/types";

export const MAX_LATENCY_MS = 5000; //max difference between client and server times
export const MAX_DRIFT = 5; //allowed difference to actual position

export const latency = ({ serverTimeMs, receivedAt }: Position) => {
  const ms = receivedAt - serverTimeMs;
  return ms >= 0 && ms < MAX_LATENCY_MS ? ms : 0;
};

export const expectedPosition = (position: Position, now: number) =>
  (position.positionMs + latency(position) + Math.max(now - position.receivedAt, 0)) / 1000;

export const shouldSeek = (current: number, expected: number) =>
  Math.abs(current - expected) > MAX_DRIFT;
