// app/dashboard/attendance/page.tsx

import Header from "@/components/dashboard/attendence/header"
import AttendanceHistory from "@/components/dashboard/attendence/history"
import StatsCards from "@/components/dashboard/attendence/statscard"


export default function AttendancePage() {


  return (

    /*
3.4 Attendance Management
3.4.1 Attendance Tracking
● Daily and weekly attendance views.
● Option for check-in/check-out for employee
● Status types:
○ Present
○ Absent
○ Half-day
○ Leave
3.4.2 Attendance View
● Employees can view only their own attendance.
● Admin/HR can view attendance of all employees.
    */
   
    <div className="container mx-auto py-6 px-4 md:px-6 space-y-8">
      <Header />

      {/* Stats Cards */}

      <StatsCards />

      {/* Attendance History */}
      <AttendanceHistory />
    </div>

  )
}






