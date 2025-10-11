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

export const MONGO_URI = getEnvVar("MONGO_URI");
export const JWT_SECRET = getEnvVar("JWT_SECRET");
export const TOP_K = 3
