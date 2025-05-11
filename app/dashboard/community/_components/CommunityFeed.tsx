"use client";

import { useEffect, useState } from "react";
import CreateCommentForm from "./CreateCommentForm";
import CommentsList from "./CommentsList";

type Post = {
  id: string;
  title: string;
  content: string;
  created_at: string;
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
        <div key={post.id} className="p-4 border rounded">
          <h2 className="text-xl font-semibold">{post.title}</h2>
          <p className="text-gray-600">{post.content}</p>
          <small className="text-xs text-gray-400">
            {new Date(post.created_at).toLocaleString()}
          </small>

          <CreateCommentForm postId={post.id} onCommentAdded={fetchPosts} />
          <CommentsList postId={post.id} />
        </div>
      ))}
    </div>
  );
}
