"use client";

import React from "react";
import { VendorSidebar } from "./_components/VendorSidebar";
import VendorAccountInfo from "./_components/VendorAccountInfo"; 


const VendorDashboardPage: React.FC = () => {
  return (
    <main className="flex gap-10 p-6 bg-background min-h-screen">
      <div className="">
        <VendorSidebar />
      </div>
      <div>
        <VendorAccountInfo />
      </div>
    </main>
  );
};

export default VendorDashboardPage;
