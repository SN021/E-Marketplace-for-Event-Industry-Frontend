"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import axios from "axios";

export default function ConversationsPage() {
  const { user, isLoaded } = useUser();
  const [conversations, setConversations] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchConvos = async () => {
      try {
        const res = await axios.get("/api/conversations/get");
        setConversations(res.data.conversations || []);
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
        setConversations([]); 
      }
    };

    fetchConvos();
  }, [isLoaded, user]);

  if (!isLoaded || !user) return <div>Loading...</div>;

  return (
    <main className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">💬 Your Conversations</h2>
      {conversations.length === 0 && (
        <p className="text-gray-600">No conversations found.</p>
      )}

      <ul className="space-y-3">
        {conversations.map((conv) => (
          <li key={conv.id} className="border p-3 rounded hover:bg-gray-100">
            <Link href={`/dashboard/chat/${conv.id}`}>
              <div className="font-medium text-blue-700">
                {conv.service?.service_title || "Service"} – {conv.status}
              </div>
              <div className="text-sm text-gray-600 truncate">
                {conv.last_message || "No messages yet"}
              </div>
              <div className="text-xs text-gray-400">
                {new Date(conv.last_message_time).toLocaleString()}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
