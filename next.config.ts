import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/dashboard/admin/:path*",
        destination: "/admin/:path*",
      },
      {
        source: "/dashboard/admin",
        destination: "/admin",
      },
      {
        source: "/admin/attendance",
        destination: "/admin/attendence",
      },
    ];
  },
};

export default nextConfig;
