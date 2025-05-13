"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { usePostContext } from "./PostContext";
import { inputContainerStyle, inputLabelStyle, inputStyle } from "@/lib/formStyle";
import { Bounce } from "react-toastify";

export default function CreatePostForm() {
  const { triggerPostRefresh } = usePostContext();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
    if (!title.trim() || !content.trim()) return;

    const errorMsg = () => {
      toast.error("An error has occurred", {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    };

    const postCreateMsg = () => {
      toast.success("Post created successfully", {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    };

    setIsLoading(true);
    const response = await fetch("/api/community/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });

    setIsLoading(false);

    if (response.ok) {
      setTitle("");
      setContent("");
      postCreateMsg();
      triggerPostRefresh(); 
    } else {
      const { error } = await response.json();
      console.error("Failed to create post:", error);
      toast.error(error || "Failed to create post");
      errorMsg();
    }
  }

  return (
    <div>
      <div className="space-y-4 py-5">
        <div className={inputContainerStyle}>
          <input
            placeholder=""
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputStyle}
          />
          <label htmlFor="title" className={inputLabelStyle}>Post Title</label>
        </div>
        <div className={inputContainerStyle}>
          <textarea
            placeholder=""
            value={content}
              rows={3}
            onChange={(e) => setContent(e.target.value)}
            className={inputStyle}
          />  
          <label htmlFor="content" className={inputLabelStyle}>Post Content</label>
        </div>
        
      </div>
      <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Posting..." : "Create Post"}
        </Button>
    </div>
  );
}
