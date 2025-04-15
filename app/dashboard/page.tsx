import React from "react";
import { HeroBanner } from "./_components/HeroBanner";
import { GigCarousel } from "./_components/GigCarousel";

export default function Dashboard() {
  return (
    <div className="h-[2000px]  px-6 md:px-10 py-4">
      <HeroBanner />
      <GigCarousel title="Continue browsing →" />
      <GigCarousel title="Gigs You May Have Liked →" />
      <GigCarousel title="Special Discounts & Promotions →" />
    </div>
  );
}
