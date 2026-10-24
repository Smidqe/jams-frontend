export const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;
export const isString = (v: unknown): v is string => typeof v === "string";
export const isNumber = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
