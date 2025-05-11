"use client";
import { useEffect, useState } from "react";

type Comment = {
  comment_id: string;
  content: string;
  created_at: string;
  vendor_id: string;
  user: {
    first_name: string | null;
    last_name: string | null;
  };
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
        <div key={comment.comment_id} className="p-2 border rounded bg-gray-50">
          <p className="font-semibold text-sm text-blue-700 mb-1">
            {comment.user?.first_name || ""}{" "}
            {comment.user?.last_name || "Unknown"}
          </p>
          <p>{comment.content}</p>
          <small className="text-xs text-gray-400 block">
            {new Date(comment.created_at).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
}
