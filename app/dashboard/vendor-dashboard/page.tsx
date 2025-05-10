"use client";

import React, { useEffect, useState } from "react";
import { VendorSidebar } from "./_components/VendorSidebar";
import VendorAccountInfo from "./_components/VendorAccountInfo";
import ViewOffers from "./_components/VendorOffers";
import axios from "axios";
import ServicesHistory from "./_components/ServicesHistory";
import EditService from "./_components/EditService";



const VendorDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Account Info");
  const [status, setStatus] = useState<"checking" | "forbidden" | "allowed">("checking");
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/get-user");
        const user = response.data?.[0];

        if (!user || !user.role) {
          console.warn("User data or role not found.");
          return;
        }

        if (user.role === "user" || user.role === "admin") {
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

  const renderTab = () => {
    if (activeTab === "Account Info") return <VendorAccountInfo />;
    if (activeTab === "View Offers") return <ViewOffers />;
    if (activeTab === "My Analytics") {
      return <div className="text-gray-500">Analytics will appear here.</div>;
    }
    if (activeTab === "Service Listing History") {
      return selectedServiceId ? (
        <EditService
          id={selectedServiceId}
          onCancel={() => setSelectedServiceId(null)}
        />
      ) : (
        <ServicesHistory onEditService={(id) => setSelectedServiceId(id)} />
      );
    }

    return <div className="text-gray-500">Coming soon.</div>;
  };

  return (
    <main className="flex flex-col md:flex-row gap-6 md:gap-10 p-4 md:p-6 bg-background min-h-screen container mx-auto">
      <div className="w-full md:max-w-xs">
        <VendorSidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setSelectedServiceId(null); 
          }}
        />
      </div>
      <div className="flex-1 w-full">{renderTab()}</div>
    </main>
  );
};

export default VendorDashboardPage;
