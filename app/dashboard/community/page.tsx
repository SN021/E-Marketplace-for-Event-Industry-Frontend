"use client";

import { useUser } from "@clerk/nextjs";
import CommunityFeed from "./_components/CommunityFeed";
import CreatePostForm from "./_components/CreatePostForm";
import axios from "axios";
import { useEffect, useState } from "react";

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
