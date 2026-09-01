import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/admin/:path*",
        destination: "/dashboard/admin/:path*",
      },
      {
        source: "/admin",
        destination: "/dashboard/admin",
      },
      {
        source: "/dashboard/admin/attendance",
        destination: "/dashboard/admin/attendence",
      },
      {
        source: "/admin/attendance",
        destination: "/dashboard/admin/attendence",
      },
      {
        source: "/dashboard/reports/:path*",
        destination: "/reports",
      },
    ];
  },
};

export default nextConfig;
