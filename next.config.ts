import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["assets.aceternity.com", "ajpladujozvygifecrfo.supabase.co"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  api: {
    bodyParser: {
      sizeLimit: "10mb", 
    },
  },
};

export default nextConfig;

