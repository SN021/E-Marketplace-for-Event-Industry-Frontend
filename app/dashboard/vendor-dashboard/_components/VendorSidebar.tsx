import React from "react";
import Image from "next/image";
import { ArrowBigRight } from "lucide-react";

const navItems = [
  { label: "Account Info " },
  { label: "Booking History" },
  { label: "Service Listing History" },
  { label: "QR History" },
  { label: "My Analytics" },
];

export const VendorSidebar: React.FC = () => {
  return (
    <aside className="bg-white shadow-sm rounded-xl p-4 w-full max-w-xs">
      <div className="flex flex-col items-center text-center">
        <Image
          src="/imageicon.png" 
          alt="Vendor"
          width={120}
          height={120}
          className="rounded-xl object-cover"
        />
        <div className="mt-2">
          <h2 className="font-semibold text-lg">Cake Florida</h2>
          <p className="text-sm text-gray-500">@cake_071</p>
          <p className="text-sm text-gray-500">xxxxxxx@gmail.com</p>
          <p className="text-xs text-gray-400 mt-1">Joined on March 2025</p>
          <p className="text-xs text-gray-400">Located in xxxx</p>
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
