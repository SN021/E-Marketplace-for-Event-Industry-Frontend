"use client";

import React, { useEffect, useState } from "react";
import { HeroBanner } from "./_components/HeroBanner";
import { ServiceCarousel } from "./_components/ServiceCarousel";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

export default function Dashboard() {
  const [pageLoading, SetPageLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      SetPageLoading(false);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  if (pageLoading) {
    return <Loader />;
  }

  return (
    <div className=" px-6 md:px-10 py-4">
      <HeroBanner />
      <ServiceCarousel title="Continue browsing →" />
    </div>
  );
}
