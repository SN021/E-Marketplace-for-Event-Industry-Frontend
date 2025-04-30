"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function ChatPage() {
  const { user, isLoaded } = useUser();
  const params = useParams();
  const conversationId = params.conversationId as string;
  const supabase = createClient();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const channel = supabase
      .channel("realtime:messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          const newMsg = payload.new;
          setMessages((prev) => [...prev, newMsg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchMessages = async () => {
      const res = await fetch(`/api/conversations/${conversationId}/messages`);
      const json = await res.json();
      setMessages(json.messages || []);
    };

    fetchMessages();
  }, [isLoaded, user, conversationId]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMsg = {
      conversationId,
      senderId: user?.id,
      content: input,
      messageType: "text"
    };

    const res = await fetch("/api/messages/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newMsg)
    });

    if (res.ok) {
      setInput("");
    } else {
      console.error("Failed to save message");
    }
  };

  if (!isLoaded || !user) {
    return <div>Loading...</div>;
  }

  return (
    <main className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">💬 Live Chat</h2>

      <div className="border h-64 overflow-y-auto p-2 mb-4 bg-white rounded shadow">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <span className="font-medium">{msg.sender_id}:</span> {msg.content}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border px-2 py-1 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          className="bg-blue-600 text-white px-4 rounded"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </main>
  );
}
