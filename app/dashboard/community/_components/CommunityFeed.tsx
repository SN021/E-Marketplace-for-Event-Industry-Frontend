"use client";

import { useEffect, useState } from "react";
import CreateCommentForm from "./CreateCommentForm";
import CommentsList from "./CommentsList";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HashLoader } from "react-spinners";
import { usePostContext } from "./PostContext";

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
  const { shouldRefreshPosts, triggerPostRefresh } = usePostContext();
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [sortOption, setSortOption] = useState<'date-newest' | 'date-oldest' | 'title-az' | 'title-za'>('date-newest');
  const POSTS_PER_PAGE = 5;

  const fetchPosts = async (pageNum: number) => {
    try {
      let order = 'desc';
      let sortBy = 'created_at';

      switch (sortOption) {
        case 'date-newest':
          order = 'desc';
          sortBy = 'created_at';
          break;
        case 'date-oldest':
          order = 'asc';
          sortBy = 'created_at';
          break;
        case 'title-az':
          order = 'asc';
          sortBy = 'title';
          break;
        case 'title-za':
          order = 'desc';
          sortBy = 'title';
          break;
      }

      const res = await fetch(
        `/api/community/posts?page=${pageNum}&limit=${POSTS_PER_PAGE}&order=${order}&sortBy=${sortBy}`
      );
      const data = await res.json();

      if (pageNum === 1) {
        setPosts(data);
      } else {
        setPosts((prev) => [...prev, ...data]);
      }

      setHasMore(data.length === POSTS_PER_PAGE);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    }
  };

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    setIsLoadingMore(true);
    try {
      setPage(nextPage);
      const res = await fetch(
        `/api/community/posts?page=${nextPage}&limit=${POSTS_PER_PAGE}&order=${sortOption === 'date-newest' || sortOption === 'title-za' ? 'desc' : 'asc'}&sortBy=${sortOption.includes('date') ? 'created_at' : 'title'}`
      );
      const data = await res.json();

      setPosts((prev) => [...prev, ...data]);
      setHasMore(data.length === POSTS_PER_PAGE);
    } catch (err) {
      console.error("Failed to load more posts", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Reset pagination when needed
  const resetPagination = () => {
    setPage(1);
    fetchPosts(1);
  };

  useEffect(() => {
    fetchPosts(1);
  }, [sortOption]);

  useEffect(() => {
    if (shouldRefreshPosts) {
      fetchPosts(1);
      triggerPostRefresh(); // Reset the flag
    }
  }, [shouldRefreshPosts]);

  const handleSortOptionChange = (newSortOption: 'date-newest' | 'date-oldest' | 'title-az' | 'title-za') => {
    setSortOption(newSortOption);
    setPage(1);
    setHasMore(true);
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <select
            value={sortOption}
            onChange={(e) => handleSortOptionChange(e.target.value as 'date-newest' | 'date-oldest' | 'title-az' | 'title-za')}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="date-newest">Date - Newest to Oldest</option>
            <option value="date-oldest">Date - Oldest to Newest</option>
            <option value="title-az">Title - A to Z</option>
            <option value="title-za">Title - Z to A</option>
          </select>
        </div>
      </div>
      {posts.map((post) => (
        <div
          key={post.post_id}
          className="p-4 border rounded bg-white shadow-sm space-y-4"
        >
          {/* Author and Date */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-primary font-semibold">
              {post.user?.first_name || ""} {post.user?.last_name || "Unknown"}
            </p>
            <small className="text-xs text-gray-400">
              {new Date(post.created_at).toLocaleString()}
            </small>
          </div>

          {/* Title and Content */}
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-gray-900">{post.title}</h2>
            <p className="text-gray-700 mt-1 break-words whitespace-pre-wrap">
              {post.content}
            </p>
          </div>

          {/* Comments Section */}
          <div className="pt-3 border-t">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-xs">
                  View Comments
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col bg-white">
                <DialogHeader>
                  <DialogTitle>Comments</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-auto">
                  <div className="space-y-4 pr-2">
                    <CreateCommentForm postId={post.post_id} />
                    <CommentsList postId={post.post_id} />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      ))}

      {/* Load More Button */}
      {hasMore && (
      <div className="flex justify-center py-4">
        {isLoadingMore ? (
          <div className="flex items-center gap-2">
            <HashLoader color="#D39D55"/>
          </div>
        ) : (
          <Button 
            onClick={handleLoadMore}
          >
            Load More Posts
          </Button>
        )}
      </div>
    )}
    </div>
  );
}
