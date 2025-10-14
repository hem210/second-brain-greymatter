export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const ContentType = {
  Youtube: "youtube",
  Twitter: "twitter",
  Note: "note",
} as const;

export type ContentType = (typeof ContentType)[keyof typeof ContentType];
