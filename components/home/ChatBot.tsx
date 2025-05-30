"use client";

import { useState, useEffect } from "react";
import { RiRobot2Fill } from "react-icons/ri";

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
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ChatResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [personality, setPersonality] = useState<string>("classic_literature");
  const [conversation, setConversation] = useState<
    { user: string; bot: string }[]
  >([]);

  useEffect(() => {
    const fetchGreeting = async () => {
      try {
        const response = await fetch(
          `/api/chat?personality=${encodeURIComponent(personality)}`
        );
        if (response.ok) {
          const data = await response.json();
          const greetingMsg =
            data.response ||
            "Welcome to the Book Search! How can I help you today?";
          setConversation([{ user: "", bot: greetingMsg }]);
        } else {
          setConversation([
            {
              user: "",
              bot: "Welcome to the Book Search! How can I help you today?",
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching greeting:", error);
        setConversation([
          {
            user: "",
            bot: "Welcome to the Book Search! How can I help you today?",
          },
        ]);
      }
    };
    fetchGreeting();
  }, [personality]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const userMessage = query;
      setQuery("");

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: userMessage,
          limit: 5,
          personality,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setResponse(data);
      setConversation((prev) => [
        ...prev,
        {
          user: userMessage,
          bot: data.response || data.message || "No response available",
        },
      ]);
    } catch (err) {
      console.error("Failed to fetch search results:", err);
      setError("Failed to search books. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Book Chat</h2>

      {/* Personality Selector */}
      <div className="mb-4">
        <label
          htmlFor="personality"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Select AI Personality
        </label>
        <select
          id="personality"
          value={personality}
          onChange={(e) => setPersonality(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded"
          disabled={loading}
        >
          <option value="classic_literature">Classic Literature</option>
          <option value="philosopher">Philosopher</option>
          <option value="storyteller">Storyteller</option>
          <option value="critic">Critic</option>
        </select>
      </div>

      {/* Conversation History */}
      <div className="mb-6">
        <div className="chatbox-container bg-white border border-gray-300 rounded-lg p-4 max-h-[400px] overflow-y-auto space-y-4 shadow-inner">
          {conversation.map((entry, idx) => (
            <div key={idx} className="space-y-2">
              {/* User message */}
              {entry.user && (
                <div className="flex justify-end">
                  <div className="bg-blue-500 text-white px-4 py-2 rounded-lg max-w-xl text-right shadow-md">
                    {entry.user}
                  </div>
                </div>
              )}
              {/* Bot message */}
              <div className="flex justify-start items-start">
                <RiRobot2Fill className="text-green-500 mr-2 mt-1" size={24} />
                <div className="bg-green-100 text-green-900 px-4 py-2 rounded-lg max-w-xl text-left shadow-md">
                  {entry.bot}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {response && response.indexes_searched && (
        <div className="text-sm text-gray-500 mb-6">
          Searched in: {response.indexes_searched.join(", ")}
        </div>
      )}

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
        </div>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {response && <div className="space-y-6"></div>}
    </div>
  );
}
