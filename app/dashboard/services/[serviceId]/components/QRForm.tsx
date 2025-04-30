"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export function QuotationRequestForm({ vendorId, serviceId }: { vendorId: string; serviceId: string }) {
  const { user } = useUser();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);

    const res = await fetch("/api/conversations/create-conversation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vendorId,
        serviceId,
        initialMessage: message
      })
    });

    const json = await res.json();
    setLoading(false);

    if (json.conversationId) {
      router.push(`/dashboard/chat/${json.conversationId}`);
    } else {
      alert("Failed to start conversation");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded shadow max-w-lg">
      <label className="block text-sm font-medium text-gray-700">Your Request</label>
      <textarea
        rows={4}
        className="w-full border rounded p-2"
        placeholder="Describe what you need..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Sending..." : "Request Quote & Start Chat"}
      </button>
    </form>
  );
}
