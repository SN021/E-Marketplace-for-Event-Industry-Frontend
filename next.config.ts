import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "assets.aceternity.com",
      "ajpladujozvygifecrfo.supabase.co",
      "dvfphywvhhnvdglbuglw.supabase.co",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/payment/success',
        destination: '/dashboard/payment/success',
        permanent: true,
      },
      {
        source: '/payment/cancel',
        destination: '/dashboard/payment/cancel',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

