import { useEffect, useState } from "react";
import { CloseIcon } from "../icons/CloseIcon";
import axios from "axios";
import { BACKEND_URL } from "../config";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  query: string;
}

interface SearchResult {
  llm_response: string;
  sources: { title: string }[];
}

export function SearchModal({ open, onClose, query }: SearchModalProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);

  useEffect(() => {
    if (!open || !query.trim()) return;

    async function performSearch() {
      setLoading(true);
      setResult(null);

      try {
        const response = await axios.post(BACKEND_URL + "/api/v1/search", {
          query,
        }, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            }
        });
        setResult(response.data);
      } catch (err) {
        console.error(err);
        alert("Search failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    performSearch();
  }, [open, query]);

  if (!open) return null;

  return (
    <div
      className="fixed z-50 inset-0 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="bg-white text-black p-6 rounded-lg shadow-lg z-10 w-[500px] max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Search Results</h2>
          <button onClick={onClose} className="cursor-pointer">
            <CloseIcon size="md" />
          </button>
        </div>

        {loading && (
          <div className="flex justify-center items-center mt-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700"></div>
          </div>
        )}

        {!loading && result && (
          <div className="mt-6 space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Response</h3>
              <p className="text-gray-700 leading-relaxed">{result.llm_response}</p>
            </div>

            {result.sources && result.sources.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Sources</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {result.sources.map((src, i) => (
                    <li key={i}>{src.title}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
