'use client';

import React, { useEffect, useState } from "react";
import { HeroBanner } from "./_components/HeroBanner";
import { ServiceCarousel } from "./_components/ServiceCarousel";
import Loader from "@/components/Loader";

export default function Dashboard() {
  const [pageLoading, SetPageLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      SetPageLoading(false);
    };

    if (document.readyState === 'complete') {
      // If the page is already loaded, trigger the handler immediately
      handleLoad();
    } else {
      // Otherwise, add event listener for the load event
      window.addEventListener('load', handleLoad);
      // Clean up the event listener on component unmount
      return () => window.removeEventListener('load', handleLoad);
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
