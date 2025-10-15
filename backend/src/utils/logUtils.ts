import axios from "axios";

export function logAxiosError(error: unknown) {
  if (axios.isAxiosError(error)) {
    console.error("Python API call failed: ", error.response?.status, error.response?.data?.detail || error.message);
  } else if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error("Unknown error:", error);
  }
}
