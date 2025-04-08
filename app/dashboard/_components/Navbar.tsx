"use client";
import React, { useState } from "react";
import { Search, Mail, Heart, Menu, X } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="px-4 md:px-10 pt-2 fixed w-full z-50">
      <div className=" bg-[#171a1b]/85 backdrop-blur-md mx-auto h-20 border-b-[1px] rounded-2xl border-gray-500 text-white">
        <div className="h-full mx-auto px-5 flex items-center justify-between">
          <Link href={"/dashboard"}>
            <div className="text-3xl font-bold text-primary tracking-wider mb-4">
              <span className="inline-block w-9 h-9 bg-primary text-white font-extrabold text-center rounded-sm mr-1">
                V
              </span>
              ENZOR
            </div>
          </Link>

          <div className="hidden md:flex items-center flex-1 mx-10">
            <div className="relative w-full max-w-xl">
              <input
                type="text"
                placeholder="Search for the perfect vendors for your special event..."
                className="w-full py-2 pl-4 pr-10 rounded-full bg-white text-sm text-gray-700 focus:outline-none"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
            </div>

            <Link
              href=""
              className="nav-a text-lg font-semibold px-10 text-center"
            >
              Community Hub
            </Link>
          </div>

          <ul className="hidden md:flex items-center justify-center gap-6 text-sm font-semibold">
            <li>
              <Link href="">
                <Mail className="nav-a" />
              </Link>
            </li>
            <li>
              <Link href="">
                <Heart className="nav-a" />
              </Link>
            </li>
            <li>
              <UserButton />
            </li>
          </ul>

          <Link href="/dashboard/create-vendor">
            <button className="primary-btn hidden md:block">
              Become Vendor
            </button>
          </Link>

          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-primary focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden px-6 py-4 bg-[#171a1b]/95 mt-2 backdrop-blur-lg rounded-2xl">
            <div className="flex flex-col space-y-4">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search vendors..."
                  className="w-full py-2 pl-4 pr-10 rounded-full bg-white text-sm text-gray-700 focus:outline-none"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
              </div>

              <Link href="" className="nav-a text-lg font-semibold">
                Community Hub
              </Link>
              <div className="flex items-center gap-4">
                <Link href="">
                  <Mail className="nav-a" />
                </Link>
                <Link href="">
                  <Heart className="nav-a" />
                </Link>
                <UserButton />
              </div>

              <Link href="/dashboard/create-vendor">
                <button className="primary-btn w-full">Become Vendor</button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
