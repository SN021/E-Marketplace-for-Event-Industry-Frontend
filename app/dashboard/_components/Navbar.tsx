"use client";
import React, { useEffect, useState } from "react";
import { Search, Mail, Heart, Menu, X, Settings } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userType, setUserType] = useState("user");
  const router = useRouter(); 

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/dashboard/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setIsMobileMenuOpen(false); 
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/get-user");
        const userData = response.data;
        const role = userData[0]?.role;        
        setUserType(role);
        
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className="px-4 md:px-10 pt-2 fixed w-full z-50">
      <div className="bg-[#171a1b]/85 backdrop-blur-md mx-auto h-20 border-b border-gray-500 text-white rounded-2xl">
        <div className="h-full px-5 flex items-center justify-between">
          <Link href="/dashboard">
            <div className="flex items-center text-3xl font-bold text-primary tracking-wider">
              <span className="inline-block w-9 h-9 bg-primary text-white font-extrabold text-center rounded-sm mr-1">
                V
              </span>
              ENZOR
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center flex-1 mx-10 space-x-6">
            <form onSubmit={handleSearch} className="relative w-full max-w-xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for the perfect vendors for your special event..."
                className="w-full py-2 pl-4 pr-10 rounded-full bg-white text-sm text-gray-700 focus:outline-none"
              />
              <button type="submit">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
              </button>
            </form>

            {userType === "vendor" && (
              <Link href="" className="nav-a text-lg font-semibold px-4">
                Community Hub
              </Link>
            )}
          </div>

          <ul className="hidden md:flex items-center gap-6 text-sm font-semibold">
            <li>
              <Link href="/dashboard/chat/conversations">
                <Mail className="nav-a" />
              </Link>
            </li>
            <li>
              <Link href="/dashboard/service-saved">
                <Heart className="nav-a" />
              </Link>
            </li>
            <li>
              <Link href="">
                <Settings className="nav-a" />
              </Link>
            </li>
            <li>
              <UserButton />
            </li>
          </ul>

          {userType === "vendor" && (
            <Link href="/dashboard/vendor-dashboard">
              <button className="primary-btn hidden md:block">
                Vendor Dashboard
              </button>
            </Link>
          )}

          {userType === "admin" && (
            <Link href="/admin/users">
              <button className="primary-btn hidden md:block">
                Admin Dashboard
              </button>
            </Link>
          )}

          {userType === "user" && (
            <Link href="/dashboard/create-vendor">
              <button className="primary-btn hidden md:block">
                Become Vendor
              </button>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-primary focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden px-6 py-4 bg-[#171a1b]/95 mt-2 backdrop-blur-lg rounded-2xl space-y-5">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vendors..."
                className="w-full py-2 pl-4 pr-10 rounded-full bg-white text-sm text-gray-700 focus:outline-none"
              />
              <button type="submit">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
              </button>
            </form>

            <div className="flex flex-col gap-3 items-center">
              {userType === "vendor" && (
                <Link href="" className="nav-a text-base font-medium">
                  Community Hub
                </Link>
              )}

              <div className="flex items-center gap-6">
                <Link href="/dashboard/chat/conversations">
                  <Mail className="nav-a" />
                </Link>
                <Link href="">
                  <Heart className="nav-a" />
                </Link>
                <UserButton />
              </div>
            </div>

            {userType === "vendor" && (
              <Link href="/dashboard/vendor-dashboard">
                <button className="primary-btn w-full">Vendor Dashboard</button>
              </Link>
            )}

            {userType === "admin" && (
              <Link href="/admin/users">
                <button className="primary-btn w-full">Admin Dashboard</button>
              </Link>
            )}

            {userType === "user" && (
              <Link href="/dashboard/create-vendor">
                <button className="primary-btn w-full">Become Vendor</button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
