import ChatBot from "@/components/home/ChatBot";
import SearchIndex from "@/components/home/SearchIndex";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <SearchIndex />
      <ChatBot />
    </main>
  );
}
