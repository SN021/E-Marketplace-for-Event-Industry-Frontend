"use client";

import React, { useEffect, useState } from "react";
import { VendorSidebar } from "./_components/VendorSidebar";
import VendorAccountInfo from "./_components/VendorAccountInfo";
import ViewOffers from "./_components/VendorOffers";
import axios from "axios";
import ServicesHistory from "./_components/ServicesHistory";
import Link from "next/link";

const dummyComponents: Record<string, React.ReactNode> = {
  "View Offers": <ViewOffers />,
  "Service Listing History": <ServicesHistory />,
  "My Analytics": (
    <div className="text-gray-500">Analytics will appear here.</div>
  ),
};

const VendorDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Account Info");
  const [status, setStatus] = useState<"checking" | "forbidden" | "allowed">(
    "checking"
  );

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

  return (
    <main className="flex flex-col md:flex-row gap-6 md:gap-10 p-4 md:p-6 bg-background min-h-screen container mx-auto">
      <div className="w-full md:max-w-xs">
        <VendorSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      <div className="flex-1 w-full">
        {activeTab === "Account Info" ? (
          <VendorAccountInfo />
        ) : (
          dummyComponents[activeTab] || (
            <div className="text-gray-500">Coming soon.</div>
          )
        )}
      </div>
    </main>
  );
};

export default VendorDashboardPage;
