import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import type { Content } from "../config";

export function useContent() {
  const [contents, setContents] = useState<Content[]>([]);
  const [error, setError] = useState<string | null>(null);

  // ✅ useCallback ensures the same refetch function reference across renders
  const fetchContent = useCallback(async () => {
    try {
      setError(null);
      const response = await axios.get(BACKEND_URL + "/api/v1/content", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      setContents(response.data.content || []);
    } catch (err) {
      console.error("Error fetching content:", err);
      setError("Failed to fetch content");
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return {
    contents,
    error,
    refetch: fetchContent, // ✅ allows manual reload
  };
}
