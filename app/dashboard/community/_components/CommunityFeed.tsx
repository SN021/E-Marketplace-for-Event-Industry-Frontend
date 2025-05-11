"use client";

import { useEffect, useState } from "react";
import CreateCommentForm from "./CreateCommentForm";
import CommentsList from "./CommentsList";

type Post = {
  post_id: string;
  title: string;
  content: string;
  created_at: string;
  vendor_id: string;
  user: {
    first_name: string | null;
    last_name: string | null;
  };
};

export default function CommunityFeed() {
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/community/posts");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.post_id}
          className="p-4 border rounded bg-white shadow-sm space-y-2"
        >
          {/* Author */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-blue-700 font-semibold">
              {post.user?.first_name || ""} {post.user?.last_name || "Unknown"}
            </p>
            <small className="text-xs text-gray-400">
              {new Date(post.created_at).toLocaleString()}
            </small>
          </div>

          {/* Title & Content */}
          <div>
            <h2 className="text-xl font-bold text-gray-900">{post.title}</h2>
            <p className="text-gray-700 mt-1">{post.content}</p>
          </div>

          {/* Comments Section */}
          <div className="pt-3 border-t">
            <CreateCommentForm
              postId={post.post_id}
              onCommentAdded={fetchPosts}
            />
            <CommentsList postId={post.post_id} />
          </div>
        </div>
      ))}
    </div>
  );
}
