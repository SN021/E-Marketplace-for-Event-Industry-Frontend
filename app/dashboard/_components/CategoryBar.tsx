"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { categories } from "@/data/categories";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { link } from "fs";
import Link from "next/link";

export const CategoryBar = () => {
  const router = useRouter();
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full bg-white shadow-md sticky top-24 z-50 py-2">
      <div className="relative flex items-center">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 z-10 h-full px-2 bg-gradient-to-r from-white to-transparent"
        >
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto scrollbar-none whitespace-nowrap px-8"
        >
          {categories.map((cat, idx) => (
            <DropdownMenu key={idx}>
              <DropdownMenuTrigger asChild>
                <Button variant={"link"}>{cat.name}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {cat.subcategories.map((sub, i) => (
                  <DropdownMenuItem key={i}>
                    <Link
                      href={`/dashboard/search?subcategory=${encodeURIComponent(
                        sub
                      )}`}
                    >
                      {sub}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 z-10 h-full px-2 bg-gradient-to-l from-white to-transparent"
        >
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
};
