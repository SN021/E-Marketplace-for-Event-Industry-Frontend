"use client";

import { useUser } from "@clerk/nextjs";
import CommunityFeed from "./_components/CommunityFeed";
import CreatePostForm from "./_components/CreatePostForm";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PostProvider } from "./_components/PostContext";

export default function CommunityPage() {
  const { isLoaded, isSignedIn } = useUser();
  const [status, setStatus] = useState<
    "checking" | "applied" | "forbidden" | "allowed"
  >("checking");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/get-user");
        const user = response.data?.[0];

        if (!user || !user.role) {
          console.warn("User data or role not found.");
          return;
        }

        if (user.role === "user") {
          setStatus("forbidden");
          return;
        }

        if (user.role === "admin") {
          setStatus("forbidden");
          return;
        }

        setStatus("allowed");
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (status === "forbidden") {
      window.location.href = "/forbidden";
    }
  }, [status]);

  if (!isLoaded) return (
    <div>
      <Loader />
    </div>
  );
  if (!isSignedIn)
    return <p className="text-red-500">Please log in to continue.</p>;

  return (
    <PostProvider>
      <div className="max-w-xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Vendor Community Hub</h1>
        <div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={"default"} className="text-xs">
              <span><Plus/></span>
              Add New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col bg-white">
            <DialogHeader>
              <DialogTitle>Add New Post</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-auto">
              <CreatePostForm />
            </div>
          </DialogContent>
        </Dialog>
        </div>
        
        <hr className="my-6" />
        <CommunityFeed />
      </div>
    </PostProvider>
  );
}
