"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  postId: string;
  onCommentAdded?: () => void;
};

export default function CreateCommentForm({ postId, onCommentAdded }: Props) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleComment = async () => {
    if (!content.trim()) return;

    setLoading(true);
    const res = await fetch("/api/community/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        post_id: postId,
        content,
      }),
    });

    setLoading(false);
    if (res.ok) {
      setContent("");
      onCommentAdded?.();
    } else {
      const { error } = await res.json();
      console.error("Failed to post comment:", error);
    }
  };

  return (
    <div className="space-y-2 mt-4">
      <Textarea
        placeholder="Write a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[60px]"
      />
      <Button onClick={handleComment} disabled={loading}>
        {loading ? "Sending..." : "Send Comment"}
      </Button>
    </div>
  );
}
