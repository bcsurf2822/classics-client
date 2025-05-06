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
        <ul className="list-disc pl-5">
          {indexes.map((index, i) => (
            <li key={i} className="mb-2">
              {index}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
