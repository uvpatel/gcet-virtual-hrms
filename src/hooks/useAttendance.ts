"use client";

import { useState, useEffect, useCallback } from "react";
import { AttendanceItem } from "@/components/admin/attendence";

interface UseAttendanceOptions {
  status?: string;
  date?: string;
  userId?: string;
}

export function useAttendance(options: UseAttendanceOptions = {}) {
  const [records, setRecords] = useState<AttendanceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendance = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (options.status && options.status !== "all") params.append("status", options.status);
      if (options.date) params.append("date", options.date);
      if (options.userId) params.append("userId", options.userId);

      const url = `/api/attendance${params.toString() ? `?${params.toString()}` : ""}`;
      const res = await fetch(url);
      const json = await res.json();

      if (json.success && Array.isArray(json.data)) {
        setRecords(json.data);
      } else {
        setRecords([]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch attendance records");
    } finally {
      setIsLoading(false);
    }
  }, [options.status, options.date, options.userId]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  return {
    records,
    isLoading,
    error,
    refetch: fetchAttendance,
  };
}
