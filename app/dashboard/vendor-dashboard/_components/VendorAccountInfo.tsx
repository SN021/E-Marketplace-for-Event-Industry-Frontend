"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { HashLoader } from "react-spinners";

export const api = axios.create({
  baseURL: "/api",
});

const VendorAccountInfo: React.FC = () => {
  const { user } = useUser();
  const [vendorData, setVendorData] = useState<any>(null);
  const [parsedLinks, setParsedLinks] = useState<{ url: string }[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const fetchVendorData = async () => {
    try {
      const res = await api.get("/get-vendor");
      setVendorData(res.data);

      const links = res.data?.social_links
        ? JSON.parse(res.data.social_links)
        : [];

      setParsedLinks(links);
    } catch (err) {
      console.error("Error fetching vendor via API:", err);
    }
  };

  useEffect(() => {
    fetchVendorData();
  }, []);

  const handleSave = async () => {
    try {
      await api.put("/update-vendor", {
        ...vendorData,
        userId: user?.id,
        social_links: JSON.stringify(parsedLinks),
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating vendor:", err);
    }
  };

  if (!vendorData)
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <HashLoader color="#D39D55" />
      </div>
    );

  return (
    <main className="w-full bg-white">
      <section className="rounded-xl p-4 sm:p-6 max-w-screen-md mx-auto shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">Vendor Account Info</h1>
        </div>

        <form className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Business Name</label>
              <input
                disabled={!isEditing}
                className="input-style w-full"
                value={vendorData.business_name || ""}
                onChange={(e) =>
                  setVendorData({
                    ...vendorData,
                    business_name: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Business Email Address
              </label>
              <input
                disabled={!isEditing}
                className="input-style w-full"
                value={vendorData.business_email || ""}
                onChange={(e) =>
                  setVendorData({
                    ...vendorData,
                    business_email: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Business Phone Number
              </label>
              <input
                disabled={!isEditing}
                className="input-style w-full"
                value={vendorData.business_phone || ""}
                onChange={(e) =>
                  setVendorData({
                    ...vendorData,
                    business_phone: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Business Address
              </label>
              <input
                disabled={!isEditing}
                className="input-style w-full"
                value={vendorData.business_address || ""}
                onChange={(e) =>
                  setVendorData({
                    ...vendorData,
                    business_address: e.target.value,
                  })
                }
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium">
                Website or Portfolio Link
              </label>
              <input
                disabled={!isEditing}
                className="input-style w-full"
                value={vendorData.website || ""}
                onChange={(e) =>
                  setVendorData({
                    ...vendorData,
                    website: e.target.value,
                  })
                }
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium">About</label>
              <textarea
                disabled={!isEditing}
                className="input-style w-full h-28"
                value={vendorData.about || ""}
                onChange={(e) =>
                  setVendorData({
                    ...vendorData,
                    about: e.target.value,
                  })
                }
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium">
                Social Media Links
              </label>
              {parsedLinks.map((link, index) => (
                <input
                  key={index}
                  disabled={!isEditing}
                  className="input-style mb-2 w-full"
                  value={link.url}
                  onChange={(e) => {
                    const updatedLinks = [...parsedLinks];
                    updatedLinks[index].url = e.target.value;
                    setParsedLinks(updatedLinks);
                  }}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
            {!isEditing ? (
              <Button type="button" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            ) : (
              <>
                <Button type="button" onClick={handleSave}>
                  Save
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    fetchVendorData();
                  }}
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </form>
      </section>
    </main>
  );
};

export default VendorAccountInfo;
