"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
});
const VendorAccountInfo: React.FC = () => {
  const [vendorData, setVendorData] = useState<any>(null);
  const [parsedLinks, setParsedLinks] = useState<{ url: string }[]>([]);

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const res = await api.get("/get-vendor");
        console.log(res.data);
        setVendorData(res.data);
        // Parse the social_links safely
        const links = res.data?.social_links
          ? JSON.parse(res.data.social_links)
          : [];

        setParsedLinks(links);
      } catch (err) {
        console.error("Error fetching vendor via API:", err);
      }
    };

    fetchVendorData();
  }, []);

  if (!vendorData) return <p className="p-6">Loading vendor data...</p>;

  return (
    <main className="flex ">
      <section className="flex-1 bg-white rounded-xl p-6 w-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">Vendor Account Info</h1>
          <Button className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600">
            Preview Buyer POV
          </Button>
        </div>

        <form className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">
                {" "}
                Business Name
              </label>
              <input
                disabled
                className="input-style"
                value={vendorData.business_name || ""}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Business Email Address
              </label>
              <input
                disabled
                className="input-style"
                value={vendorData.business_email || ""}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Business Phone Number
              </label>
              <input
                disabled
                className="input-style"
                value={vendorData.business_phone || ""}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Business Address
              </label>
              <input
                disabled
                className="input-style"
                value={vendorData.business_address || ""}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Experience Level
              </label>
              <input
                disabled
                className="input-style"
                value={vendorData.experience || ""}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Website or Portfolio Link
              </label>
              <input
                disabled
                className="input-style"
                value={vendorData.website || ""}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">About</label>
              <textarea
                disabled
                className="input-style h-30"
                value={vendorData.about || ""}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Social Media Links
              </label>
              {parsedLinks.map((link, index) => (
                <input
                  key={index}
                  disabled
                  className="input-style mb-2"
                  value={link.url}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
          >
            Edit
          </button>
        </form>
      </section>
    </main>
  );
};

export default VendorAccountInfo;
