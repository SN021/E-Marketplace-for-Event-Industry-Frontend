"use client";

import React from "react";
import { ChevronRight } from "lucide-react";

const categories = [
  {
    name: "Event Planning & Coordination",
    subcategories: [
      "Full-Service Event Planning",
      "Wedding & Social Event Coordinating",
      "Corporate & Conference Organizing",
    ],
  },
  {
    name: "Venue & Location",
    subcategories: [
      "Event Venues & Halls",
      "Outdoor & Unique Locations",
      "Venue Management Services",
    ],
  },
  {
    name: "Catering & Food Services",
    subcategories: [
      "Bakery & Cake",
      "Caterers & Gourmet Food Providing",
      "Food Trucks & Pop-Up Kitchens" ,
      "Dessert & Beverage Services",
    ],
  },
  {
    name: "Decoration & Floral",
    subcategories: ["Stage Decor", "Table Centerpieces", "Floral Arches"],
  },
  {
    name: "Entertainment & Performers",
    subcategories: ["Live Bands", "DJ", "Cultural Acts"],
  },
  {
    name: "Beauty & Grooming",
    subcategories: ["Makeup", "Hair Styling", "Spa Services"],
  },
  {
    name: "Photography & Videography",
    subcategories: ["Cinematography", "Drone Shoots", "Albums"],
  },
  {
    name: "Invitation, Stationery & Branding",
    subcategories: ["Printed Invitations", "Digital Cards", "Logos"],
  },
  {
    name: "Audio-Visual & Technology",
    subcategories: ["Lighting", "LED Screens", "Projectors"],
  },
  {
    name: "Transportation & Logistics",
    subcategories: ["Shuttle Services", "Luxury Cars", "Vendor Transport"],
  },
];

export const CategoryBar = () => {
  return (
    <div className="w-full bg-white shadow-md z-50">
      <div className="flex overflow-x-auto hide-scrollbar whitespace-nowrap px-4">
        {categories.map((cat, idx) => (
          <div key={idx} className="relative group px-6 py-4 hover:bg-gray-100 cursor-pointer">
            <span className="text-sm font-medium whitespace-nowrap">{cat.name}</span>

            {/* Dropdown */}
            <div className="absolute left-0 top-full mt-2 hidden group-hover:block bg-white shadow-lg rounded-md min-w-[220px] z-50">
              <ul className="py-2">
                {cat.subcategories.map((sub, i) => (
                  <li
                    key={i}
                    className="px-4 py-2 hover:bg-gray-100 text-sm text-gray-700 cursor-pointer"
                  >
                    {sub}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
