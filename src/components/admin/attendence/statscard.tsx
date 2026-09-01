"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminAttendanceStatsProps } from "@/types/adminattendence.type";
import { Users, UserCheck, UserX, CalendarClock } from "lucide-react";



export function AdminAttendanceStatsCards({
  totalEmployees,
  presentCount,
  absentCount,
  leaveCount,
  halfDayCount,
  isLoading,
}: AdminAttendanceStatsProps) {
  const attendanceRate = totalEmployees > 0
    ? (((presentCount + halfDayCount * 0.5) / totalEmployees) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "..." : totalEmployees}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Registered employees
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-xs border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
            Present Today
          </CardTitle>
          <UserCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {isLoading ? "..." : presentCount}
          </div>
          <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-1">
            {attendanceRate}% attendance rate
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-xs border-destructive/20 bg-destructive/5 dark:bg-destructive/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-destructive">
            Absent
          </CardTitle>
          <UserX className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">
            {isLoading ? "..." : absentCount}
          </div>
          <p className="text-xs text-destructive/80 mt-1">
            Unaccounted absence
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-xs border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-amber-600 dark:text-amber-400">
            On Leave / Half Day
          </CardTitle>
          <CalendarClock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {isLoading ? "..." : `${leaveCount} / ${halfDayCount}`}
          </div>
          <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-1">
            Approved leaves / half-day shifts
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
