import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is missing`);
  }
  return value;
}

export const BACKEND_URL = getEnvVar("BACKEND_URL");

export const ContentType = {
  Youtube: "youtube",
  Twitter: "twitter",
  Note: "note",
} as const;

export type ContentType = (typeof ContentType)[keyof typeof ContentType];
