export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

export const ContentType = {
  Youtube: "youtube",
  Twitter: "twitter",
  Note: "note",
  Article: "article"
} as const;

export type ContentType = (typeof ContentType)[keyof typeof ContentType];

export type Content = {
  _id: string;
  title: string;
  link: string;
  content?: string;
  type: ContentType;
};
