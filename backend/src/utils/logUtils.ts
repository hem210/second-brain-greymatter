import axios from "axios";

export function logAxiosError(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Server responded with a non-2xx status
      console.error("Python API responded with an error:", {
        status: error.response.status,
        statusText: error.response.statusText,
        url: error.config?.url,
        method: error.config?.method,
        detail: error.response.data?.detail,
        data: error.response.data,
      });
    } else if (error.request) {
      // Request sent but no response received
      console.error("No response from Python API:", {
        url: error.config?.url,
        method: error.config?.method,
        timeout: error.config?.timeout,
      });
    } else {
      // Something went wrong before the request was sent
      console.error("Error setting up Python API request:", {
        message: error.message,
        url: error.config?.url,
      });
    }
  } else if (error instanceof Error) {
    console.error("Unexpected error:", error.message);
  } else {
    console.error("Unknown error object:", error);
  }
}
