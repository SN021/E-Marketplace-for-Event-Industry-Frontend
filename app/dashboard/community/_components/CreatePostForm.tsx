"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";



export default function CreatePostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    const res = await fetch("/api/community/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });

    setLoading(false);

    if (res.ok) {
      setTitle("");
      setContent("");
      alert("Post created!");
    } else {
      const { error } = await res.json();
      console.error("Failed to create post:", error);
    }
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        placeholder="Write something..."
        value={content}
        rows={3}
        onChange={(e) => setContent(e.target.value)}
      />
      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Posting..." : "Create Post"}
      </Button>
    </div>
  );
}
