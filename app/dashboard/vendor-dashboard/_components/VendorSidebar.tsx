import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const navItems = [
  "Account Info",
  "View Offers",
  "Service Listing History",
  "My Analytics",
];

type SidebarProps = {
  activeTab: string;
  onTabChange: (label: string) => void;
};

export const api = axios.create({
  baseURL: "/api",
});

export const VendorSidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
}) => {
  const { user } = useUser();
  const [vendorData, setVendorData] = useState<any>(null);
  const [profilePicturePath, setProfilePicturePath] = useState<string | null>(
    null
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const res = await api.get("/get-vendor");
        setVendorData(res.data);

        const formData = new FormData();
        formData.append("type", "profile");
        formData.append("userId", user?.id || "");

        const profileRes = await api.post("/get-file", formData);
        setProfilePicturePath(profileRes.data?.signedUrl || null);
      } catch (err) {
        console.error("Error loading vendor data:", err);
      }
    };

    if (user?.id) {
      fetchVendorData();
    }
  }, [user?.id]);

  const SidebarContent = () => (
    <div className="bg-white shadow-md rounded-xl p-4 w-full max-w-xs h-full">
      <div className="flex flex-col items-center text-center">
        <Image
          src={profilePicturePath || "/images/imageicon.png"}
          alt="Vendor"
          width={180}
          height={180}
          className="rounded-full object-cover w-40 h-40"
        />
        <div className="mt-2">
          <h2 className="font-semibold text-lg">{vendorData?.display_name}</h2>
          <p className="text-sm text-gray-500">
            @{vendorData?.vendor_username}
          </p>
          <p className="text-sm text-gray-500">{vendorData?.business_name}</p>
          <p className="text-xs text-gray-400 mt-1">
            {vendorData?.created_at &&
              new Date(vendorData.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
          </p>
          <p className="text-xs text-gray-400">{`${vendorData?.city}, ${vendorData?.province}`}</p>
        </div>
      </div>

      <div className="mt-6 space-y-2 px-6">
        {navItems.map((label) => (
          <Button
            key={label}
            onClick={() => {
              onTabChange(label);
              setMobileOpen(false); // close drawer on mobile
            }}
            className={`w-full text-left px-4 py-2 text-sm rounded-md ${
              activeTab === label
                ? "bg-primary text-white hover:bg-primary/80"
                : "bg-primary/50 hover:bg-primary/30 text-orange-900 hover:text-orange-900/80"
            }`}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden flex justify-end mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </Button>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <SidebarContent />
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-start">
          <div className="bg-white w-80 h-full shadow-lg p-4">
            <div className="flex justify-end mb-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setMobileOpen(false)}
              >
                Close
              </Button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};
