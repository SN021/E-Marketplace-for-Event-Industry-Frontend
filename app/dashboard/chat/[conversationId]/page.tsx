"use client";

import { useEffect, useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";
import axios from "axios";

export default function ChatPage() {
  const { user, isLoaded } = useUser();
  const params = useParams();
  const conversationId = params.conversationId as string;
  const supabase = createClient();

  const [input, setInput] = useState("");
  const [userId, setUserId] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/get-user");
        const userData = response.data;
        const id = userData[0]?.id;
        setUserId(id);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMsg = payload.new;
          if (newMsg) {
            setMessages((prev) => [...prev, newMsg]);
          }
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
      try {
        const res = await axios.get(
          `/api/conversations/${conversationId}/messages`
        );
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [isLoaded, user, conversationId]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMsg = {
      conversationId,
      senderId: user?.id,
      content: input,
      messageType: "text",
    };

    try {
      await axios.post("/api/messages/send", newMsg);
      setInput("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  if (!isLoaded || !user) return <div>Loading...</div>;

  return (
    <main className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">💬 Live Chat</h2>

      <div className="border h-64 overflow-y-auto p-2 mb-4 bg-white rounded shadow flex flex-col">
        {messages.map((msg, index) => {
          const isSelf = msg.sender_id === userId;
          return (
            <div
              key={index}
              className={`mb-2 max-w-[70%] px-3 py-2 rounded-lg text-sm whitespace-pre-wrap ${
                isSelf
                  ? "ml-auto bg-blue-100 text-right"
                  : "mr-auto bg-gray-100 text-left"
              }`}
            >
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          );
        })}
        <div ref={bottomRef} />
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
