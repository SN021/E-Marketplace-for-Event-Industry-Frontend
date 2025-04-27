import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["assets.aceternity.com", "ajpladujozvygifecrfo.supabase.co","giewcrapmvawdzcnstzn.supabase.co"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

};

export default nextConfig;

