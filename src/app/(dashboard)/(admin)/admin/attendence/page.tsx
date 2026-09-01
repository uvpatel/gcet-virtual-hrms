"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import {
  AdminAttendanceHeader,
  AdminAttendanceStatsCards,
  AdminAttendanceFilters,
  AdminAttendanceTable,
  AdminManualAttendanceModal,
  AdminEditAttendanceModal,
  type AttendanceItem,
} from "@/components/admin/attendence";

export default function AdminAttendancePage() {
  const [records, setRecords] = useState<AttendanceItem[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter States
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");

  // Modal States
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AttendanceItem | null>(null);

  // Fetch Attendance Records
  const fetchAttendance = useCallback(async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setIsRefreshing(true);
    try {
      const params = new URLSearchParams();
      if (status !== "all") params.append("status", status);
      if (selectedDate) params.append("date", selectedDate);

      const url = `/api/attendance${params.toString() ? `?${params.toString()}` : ""}`;
      const res = await fetch(url);
      const json = await res.json();

      if (json.success && Array.isArray(json.data)) {
        setRecords(json.data);
      } else {
        setRecords([]);
      }
    } catch (err: any) {
      console.error("Failed to fetch attendance:", err);
      toast.error("Failed to load attendance records");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [status, selectedDate]);

  // Fetch Employees for manual marking and stats
  const fetchEmployees = useCallback(async () => {
    try {
      const res = await fetch("/api/employees?limit=200");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        // Extract user objects from profiles
        const employeeUsers = json.data
          .filter((emp: any) => emp.user)
          .map((emp: any) => ({
            _id: emp.user._id,
            name: emp.user.name,
            email: emp.user.email,
            role: emp.user.role,
            department: emp.department,
          }));
        setEmployees(employeeUsers);
      }
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    }
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Filter records by search term
  const filteredRecords = useMemo(() => {
    if (!search.trim()) return records;
    const term = search.toLowerCase();
    return records.filter((rec) => {
      const name = rec.user?.name?.toLowerCase() || "";
      const email = rec.user?.email?.toLowerCase() || "";
      const empId = rec.user?.employeeId?.toLowerCase() || "";
      return name.includes(term) || email.includes(term) || empId.includes(term);
    });
  }, [records, search]);

  // Stats calculation
  const stats = useMemo(() => {
    const present = records.filter((r) => r.status === "present").length;
    const absent = records.filter((r) => r.status === "absent").length;
    const leave = records.filter((r) => r.status === "leave").length;
    const halfDay = records.filter((r) => r.status === "half-day").length;
    const total = employees.length > 0 ? employees.length : records.length;

    return {
      totalEmployees: total,
      presentCount: present,
      absentCount: absent,
      leaveCount: leave,
      halfDayCount: halfDay,
    };
  }, [records, employees]);

  // Quick Check-out handler
  const handleQuickCheckout = async (record: AttendanceItem) => {
    try {
      const now = new Date().toISOString();
      const res = await fetch(`/api/attendance/${record._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkOut: now }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to mark check-out");

      toast.success(`Marked check-out for ${record.user?.name || record.user?.email}`);
      fetchAttendance();
    } catch (err: any) {
      toast.error(err.message || "Failed to mark check-out");
    }
  };

  // Delete Attendance record handler
  const handleDeleteRecord = async (id: string) => {
    if (!confirm("Are you sure you want to delete this attendance record?")) return;

    try {
      const res = await fetch(`/api/attendance/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to delete record");

      toast.success("Attendance record deleted");
      fetchAttendance();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete record");
    }
  };

  // Export CSV handler
  const handleExportCSV = () => {
    if (filteredRecords.length === 0) {
      toast.error("No attendance data to export");
      return;
    }

    const headers = ["Employee Name", "Email", "Date", "Check In", "Check Out", "Status"];
    const rows = filteredRecords.map((r) => [
      `"${r.user?.name || ""}"`,
      `"${r.user?.email || ""}"`,
      `"${new Date(r.date).toLocaleDateString()}"`,
      `"${r.checkIn ? new Date(r.checkIn).toLocaleTimeString() : "—"}"`,
      `"${r.checkOut ? new Date(r.checkOut).toLocaleTimeString() : "—"}"`,
      `"${r.status}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `attendance_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Attendance CSV exported successfully");
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatus("all");
    setSelectedDate("");
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <AdminAttendanceHeader
        onOpenManualModal={() => setIsManualModalOpen(true)}
        onRefresh={() => fetchAttendance(true)}
        onExport={handleExportCSV}
        isLoading={isRefreshing}
      />

      {/* Stats Summary */}
      <AdminAttendanceStatsCards
        totalEmployees={stats.totalEmployees}
        presentCount={stats.presentCount}
        absentCount={stats.absentCount}
        leaveCount={stats.leaveCount}
        halfDayCount={stats.halfDayCount}
        isLoading={isLoading}
      />

      {/* Filters Toolbar */}
      <AdminAttendanceFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onReset={handleResetFilters}
      />

      {/* Attendance Table */}
      <AdminAttendanceTable
        records={filteredRecords}
        isLoading={isLoading}
        onEdit={(rec) => setEditingRecord(rec)}
        onDelete={handleDeleteRecord}
        onQuickCheckout={handleQuickCheckout}
      />

      {/* Manual Attendance Dialog */}
      <AdminManualAttendanceModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        employees={employees}
        onSuccess={() => {
          fetchAttendance();
        }}
      />

      {/* Edit Attendance Dialog */}
      <AdminEditAttendanceModal
        isOpen={!!editingRecord}
        onClose={() => setEditingRecord(null)}
        record={editingRecord}
        onSuccess={() => {
          fetchAttendance();
        }}
      />
    </div>
  );
}

