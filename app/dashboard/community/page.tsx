"use client";

import { useUser } from "@clerk/nextjs";
import CommunityFeed from "./_components/CommunityFeed";
import CreatePostForm from "./_components/CreatePostForm";

export default function CommunityPage() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return <p>Loading...</p>;
  if (!isSignedIn)
    return <p className="text-red-500">Please log in to continue.</p>;

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Vendor Community Hub</h1>
      <CreatePostForm />
      <hr className="my-6" />
      <CommunityFeed />
    </div>
  );
}
