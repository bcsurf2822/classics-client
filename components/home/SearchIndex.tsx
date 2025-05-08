"use client";

import { useState, useEffect } from "react";

export default function SearchIndex() {
  const [indexes, setIndexes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIndexes = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/index");

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setIndexes(data.indexes || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch book indexes:", err);
        setError("Failed to load book indexes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchIndexes();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Available Book Indexes</h2>

      {loading && <p>Loading book indexes...</p>}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!loading && !error && indexes.length === 0 && (
        <p>No book indexes available.</p>
      )}

      {indexes.length > 0 && (
        <div className="flex justify-center">
          <div className="w-full max-w-md bg-gray-100 rounded shadow-md border-t-2 border-b-2 border-gray-300">
            {indexes.map((index, i) => (
              <div
                key={i}
                className={`px-6 py-2 text-left text-sm font-normal ${
                  i !== indexes.length - 1 ? "border-b border-gray-200" : ""
                }`}
              >
                {index}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
