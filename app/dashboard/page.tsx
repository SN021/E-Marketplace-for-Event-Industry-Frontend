import React from "react";
import { HeroBanner } from "./_components/HeroBanner";
import { ServiceCarousel } from "./_components/ServiceCarousel";
import { CategoryBar } from "./_components/CategoryBar";

export default function Dashboard() {
  return (
    <div className=" px-6 md:px-10 py-4">

      <HeroBanner />
      <ServiceCarousel title="Continue browsing →" />
    </div>
  );
}
