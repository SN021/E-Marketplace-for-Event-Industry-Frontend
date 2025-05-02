"use client";

import { useEffect, useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { OfferForm } from "./_components/OfferForm";
import { OfferBubble } from "./_components/OfferBubble";

export default function ChatPage() {
  const { user, isLoaded } = useUser();
  const params = useParams();

  const conversationId = (() => {
    if (!params?.conversationId) return null;
    return Array.isArray(params.conversationId)
      ? params.conversationId[0]
      : params.conversationId;
  })();
  const supabase = createClient();

  const [input, setInput] = useState("");
  const [userId, setUserId] = useState("");
  const [convVendor, setConvVendor] = useState("");
  const [convClient, setConvClient] = useState("");
  const [isVendor, setIsVendor] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!conversationId) return;

    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/get-user");
        const userData = response.data;
        const id = userData[0]?.id;
        const vendorStatus = userData[0]?.is_vendor;

        const conversationResponse = await axios.get(
          `/api/conversations/${conversationId}`
        );

        const conversationData = conversationResponse.data.conversation;
        setConvClient(conversationData.client_id);
        setConvVendor(conversationData.vendor_id);
        if (vendorStatus) setIsVendor(true);
        setUserId(id);
      } catch (error) {
        console.error("Failed to fetch user data or conversation:", error);
      }
    };

    fetchUserData();
  }, [conversationId]);

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
    <main className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Live Chat</h2>

      <div className="border h-96 overflow-y-auto p-4 mb-4 bg-white rounded shadow flex flex-col space-y-2">
        {messages.map((msg, index) => {
          const isSelf = msg.sender_id === userId;

          if (msg.message_type === "offer") {
            const raw = msg.content;
            const offerId = raw.replace(/^Offer:\s*/, "");
            return (
              <OfferBubble key={index} offerId={offerId} isSelf={isSelf} />
            );
          }

          return (
            <div
              key={index}
              className={`flex flex-col ${
                isSelf ? "items-end" : "items-start"
              } text-sm`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm whitespace-pre-wrap ${
                  isSelf
                    ? "bg-primary/80 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
              <span className="text-xs text-gray-400 mt-1">
                {isSelf ? "You" : "Other"} ·{" "}
                {new Date(msg.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
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
        <div className="flex gap-5">
          <Button onClick={handleSend}>Send</Button>
          {convVendor === userId && conversationId && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant={"outline"}>Offer</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create an Offer</DialogTitle>
                </DialogHeader>
                <div>
                  <OfferForm
                    conversationId={conversationId}
                    vendorId={convVendor}
                  />
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </main>
  );
}
