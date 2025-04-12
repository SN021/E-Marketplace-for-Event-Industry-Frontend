import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowBigRight } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

const navItems = [
  { label: "Account Info " },
  { label: "Booking History" },
  { label: "Service Listing History" },
  { label: "QR History" },
  { label: "My Analytics" },
];

export const api = axios.create({
  baseURL: "/api",
});

export const VendorSidebar: React.FC = () => {
  const { user } = useUser();
  const [vendorData, setVendorData] = useState<any>(null);
  const [parsedLinks, setParsedLinks] = useState<{ url: string }[]>([]);
  const [profilePicturePath, setProfilePicturePath] = useState();

  const fetchVendorData = async () => {
    try {
      const res = await api.get("/get-vendor");
      setVendorData(res.data);

      const links = res.data?.social_links
        ? JSON.parse(res.data.social_links)
        : [];

      const formData = new FormData();
      formData.append("type", "profile");
      formData.append("userId", user?.id || ""); // Clerk user ID

      const profilePictureRes = await api.post("/get-file", formData);
      const signedProfileUrl = profilePictureRes.data?.signedUrl;

      setProfilePicturePath(signedProfileUrl); // Store in state
      setParsedLinks(links);
    } catch (err) {
      console.error("Error fetching vendor via API:", err);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchVendorData();
    }
  }, [user?.id]);


  return (
    <aside className="bg-white shadow-sm rounded-xl p-4 w-full max-w-xs">
      <div className="flex flex-col items-center text-center">
        <Image
          src={profilePicturePath || "/images/imageicon.png"} // fallback
          alt="Vendor"
          width={220}
          height={220}
          className="rounded-full object-cover w-42 h-42"
        />
        <div className="mt-2">
          <h2 className="font-semibold text-lg">{vendorData?.display_name}</h2>
          <p className="text-sm text-gray-500">{"@"}{vendorData?.vendor_username}</p>
          <p className="text-sm text-gray-500">{vendorData?.business_name}</p>
          <p className="text-xs text-gray-400 mt-1">
            {vendorData?.created_at
              ? new Date(vendorData.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : ""}
          </p>
          <p className="text-xs text-gray-400">{`${vendorData?.city}, ${vendorData?.province}`}</p>
        </div>
      </div>
      <div className="mt-6 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            className="w-full text-left px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="mt-4 text-xs text-gray-500 space-y-1">
        <p>✓ Email Confirmed</p>
        <p>✓ Mobile Confirmed</p>
      </div>
    </aside>
  );
};
