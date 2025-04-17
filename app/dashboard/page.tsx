import React from "react";
import { HeroBanner } from "./_components/HeroBanner";
import { ServiceCarousel } from "./_components/ServiceCarousel";

export default function Dashboard() {
  return (
    <div className="h-[2000px]  px-6 md:px-10 py-4">
      <HeroBanner />
      <ServiceCarousel title="Continue browsing →" />
      <ServiceCarousel title="" />
      <ServiceCarousel title="" />
      <ServiceCarousel title="" />
    </div>
  );
}
