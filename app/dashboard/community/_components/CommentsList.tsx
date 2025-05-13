"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { HashLoader } from "react-spinners";

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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [isLoading, setIsLoading] = useState(true);
  const COMMENTS_PER_PAGE = 5;

  const fetchComments = async (pageNum: number, order: 'desc' | 'asc' = sortOrder) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/community/comments/${postId}?page=${pageNum}&limit=${COMMENTS_PER_PAGE}&order=${order}`
      );
      const data = await res.json();

      if (pageNum === 1) {
        setComments(data);
      } else {
        setComments((prev) => [...prev, ...data]);
      }

      // If we received fewer comments than the limit, there are no more comments
      setHasMore(data.length === COMMENTS_PER_PAGE);
    } catch (err) {
      console.error("Failed to load comments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments(1);
  }, [postId, sortOrder]);

  const handleLoadMoreComments = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchComments(nextPage);
  };

  const toggleSortOrder = () => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newOrder);
    setPage(1);
    fetchComments(1, newOrder);
  };

  if (isLoading && comments.length === 0) {
    return (
      <div className="flex w-full justify-center items-center py-4">
        <HashLoader color="#D39D55" />
      </div>
    );
  }

  if (!comments.length)
    return <p className="text-sm text-muted-foreground">No comments yet.</p>;

  return (
    <div className="space-y-4 mt-4 w-full">
      <div className="flex justify-between items-center mb-2 w-full">
        <Button
          onClick={toggleSortOrder}
          className="text-sm text-blue-600 hover:text-blue-500 hover:underline"
          variant="link"
        >
          Sort {sortOrder === 'desc' ? 'Oldest' : 'Newest'} First
        </Button>
        {isLoading && (
          <div className="mx-auto relative">
            <HashLoader color="#D39D55" />
          </div>
        )}
      </div>
      {comments.map((comment) => (
        <div key={comment.comment_id} className="p-2 border rounded bg-gray-50 flex flex-col gap-2 shadow-sm">
          <p className="font-semibold text-sm text-primary mb-1">
            {comment.user?.first_name || ""}{" "}
            {comment.user?.last_name || "Unknown"}
          </p>
          <p>{comment.content}</p>
          <small className="text-xs text-gray-400 block">
            {new Date(comment.created_at).toLocaleString()}
          </small>
        </div>
      ))}

      {hasMore && (
        <div className="flex justify-center py-2">
          <button
            onClick={handleLoadMoreComments}
            disabled={isLoading}
            className="text-sm text-blue-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Load More Comments
          </button>
        </div>
      )}
    </div>
  );
}
