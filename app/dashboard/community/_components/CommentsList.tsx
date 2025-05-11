"use client";
import { useEffect, useState } from "react";

type Comment = {
  id: string;
  content: string;
  created_at: string;
  vendor_id: string;
};

type Props = {
  postId: string;
};

export default function CommentsList({ postId }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/community/comments/${postId}`);
        const data = await res.json();
        setComments(data);
      } catch (err) {
        console.error("Failed to load comments:", err);
      }
    };

    fetchComments();
  }, [postId]);

  if (!comments.length)
    return <p className="text-sm text-muted-foreground">No comments yet.</p>;

  return (
    <div className="space-y-4 mt-4">
      {comments.map((comment) => (
        <div key={comment.id} className="p-2 border rounded bg-gray-50">
          <p>{comment.content}</p>
          <small className="text-xs text-gray-400 block">
            {new Date(comment.created_at).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
}
