"use client";

import { useState, useEffect } from "react";

type SearchResult = {
  text: string;
  metadata: {
    title: string;
    chapter?: string;
    page?: number;
  };
};

type ChatResponse = {
  results: SearchResult[];
  response: string;
  indexes_searched: string[];
  message?: string;
};

export default function ChatBot() {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<string>("");
  const [indexes, setIndexes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ChatResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIndexes = async () => {
      try {
        const response = await fetch("/api/index");
        if (response.ok) {
          const data = await response.json();
          setIndexes(data.indexes || []);
        }
      } catch (error) {
        console.error("Failed to fetch book indexes:", error);
      }
    };

    fetchIndexes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          indexName: selectedIndex || null,
          limit: 5,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (data.results) {
        console.log("Results count:", data.results.length);
        if (data.results.length > 0) {
          console.log(
            "First result item:",
            JSON.stringify(data.results[0], null, 2)
          );
        }
      } else {
        console.log("No results property in response");
      }

      setResponse(data);
    } catch (err) {
      console.error("Failed to fetch search results:", err);
      setError("Failed to search books. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Book Search</h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question about the books..."
              className="flex-1 p-2 border border-gray-300 rounded"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-300"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          {indexes.length > 0 && (
            <div>
              <label
                htmlFor="bookIndex"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Select specific book (optional)
              </label>
              <select
                id="bookIndex"
                value={selectedIndex}
                onChange={(e) => setSelectedIndex(e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded"
                disabled={loading}
              >
                <option value="">All books</option>
                {indexes.map((index, i) => (
                  <option key={i} value={index}>
                    {index}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {response && (
        <div className="space-y-6">
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold mb-2">Response:</h3>
            <p className="whitespace-pre-line">
              {response.response || response.message}
            </p>
          </div>

          {response.results && response.results.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Relevant Passages:</h3>
              <div className="space-y-4">
                {response.results.map((result, index) => {
                  console.log("Processing result item:", index, result);

                  if (!result) {
                    console.error(
                      "Result is undefined or null at index:",
                      index
                    );
                    return <div key={index}>Invalid result data</div>;
                  }

                  if (!result.metadata) {
                    console.error(
                      "No metadata in result at index:",
                      index,
                      result
                    );
                    return (
                      <div
                        key={index}
                        className="border-l-4 border-blue-500 pl-4 py-2"
                      >
                        <p className="italic text-sm">[Missing metadata]</p>
                        <p>{result.text || "No text available"}</p>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={index}
                      className="border-l-4 border-blue-500 pl-4 py-2"
                    >
                      <p className="text-sm text-gray-600 mb-1">
                        {result.metadata.title || "Untitled"}
                        {result.metadata.chapter &&
                          ` - ${result.metadata.chapter}`}
                        {result.metadata.page &&
                          ` (Page ${result.metadata.page})`}
                      </p>
                      <p>{result.text || "No text available"}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {response.indexes_searched && (
            <div className="text-sm text-gray-500">
              Searched in: {response.indexes_searched.join(", ")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
