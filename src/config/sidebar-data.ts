import {
  IconDashboard,
  IconUsers,
  IconCalendar,
  IconFileText,
  IconWallet,
  IconChecklist,
  IconSettings,
  IconHelp,
  IconSearch,
  IconReport,
  IconFileInvoice,
  IconUser,
} from "@tabler/icons-react";

export type UserRole = "ADMIN" | "EMPLOYEE";

export const getSidebarData = (role: UserRole, user?: { name?: string; email?: string; image?: string }) => ({
  user: {
    name: user?.name || "Patel Urvil",
    email: user?.email || "uvpatel7271@gmail.com",
    avatar: user?.image || "/avatars/user.jpg",
  },

  navMain:
    role === "ADMIN"
      ? [
          {
            title: "Admin Dashboard",
            url: "/admin/dashboard",
            icon: IconDashboard,
          },
          {
            title: "Employees",
            url: "/dashboard/employee",
            icon: IconUsers,
          },
          {
            title: "Attendance Management",
            url: "/admin/attendence",
            icon: IconCalendar,
          },
          {
            title: "Leave Approvals",
            url: "/admin/leaves",
            icon: IconChecklist,
          },
          {
            title: "Payroll Management",
            url: "/admin/payroll",
            icon: IconWallet,
          },
        ]
      : [
          {
            title: "Dashboard",
            url: "/dashboard",
            icon: IconDashboard,
          },
          {
            title: "My Profile",
            url: "/dashboard/profile",
            icon: IconUser,
          },
          {
            title: "Attendance",
            url: "/dashboard/attendance",
            icon: IconCalendar,
          },
          {
            title: "Leaves",
            url: "/dashboard/leaves",
            icon: IconFileText,
          },
          {
            title: "Payroll",
            url: "/dashboard/payroll",
            icon: IconWallet,
          },
        ],

  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
    {
      title: "Help",
      url: "/dashboard/help",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "/dashboard/search",
      icon: IconSearch,
    },
  ],

  documents:
    role === "ADMIN"
      ? [
          {
            name: "Attendance Report",
            url: "/dashboard/reports/attendance",
            icon: IconReport,
          },
          {
            name: "Salary Slips",
            url: "/dashboard/reports/salary",
            icon: IconFileInvoice,
          },
        ]
      : [
          {
            name: "My Salary Slips",
            url: "/dashboard/payroll/slips",
            icon: IconFileInvoice,
          },
        ],
});
