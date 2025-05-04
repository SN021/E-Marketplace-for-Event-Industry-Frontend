"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import axios from "axios";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";

export default function ConversationsPage() {
  const { user, isLoaded } = useUser();
  const [conversations, setConversations] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchConvos = async () => {
      try {
        const res = await axios.get(
          `/api/conversations/get?page=${currentPage}`
        );
        setConversations(res.data.conversations || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
        setConversations([]);
      }
    };

    fetchConvos();
  }, [isLoaded, user, currentPage]);

  if (!isLoaded || !user)
    return (
      <div>
        <Loader />
      </div>
    );

  return (
    <main className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Conversations</h2>
      {conversations.length === 0 && (
        <p className="text-gray-600">No conversations found.</p>
      )}

      <ul className="space-y-3">
        {conversations.map((conv) => (
          <li
            key={conv.id}
            className="border p-3 rounded hover:bg-gray-50 transition"
          >
            <Link href={`/dashboard/chat/${conv.id}`}>
              <div className="flex items-center justify-between">
                <span className="font-medium text-primary">
                  {conv.service?.service_title || "Service"}
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full 
                  ${
                    conv.status === "active"
                      ? "bg-green-100 text-green-700"
                      : conv.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {conv.status}
                </span>
              </div>
              <div className="text-sm text-gray-600 truncate mt-1">
                {conv.last_message || "No messages yet"}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(conv.last_message_time).toLocaleString()}
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
          <span className="px-4 py-2 text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            Next
          </Button>
        </div>
      )}
    </main>
  );
}
