"use client";

import { Button } from "@/components/ui/button";
import { Download, Plus, RefreshCw } from "lucide-react";

interface AdminAttendanceHeaderProps {
  onOpenManualModal: () => void;
  onRefresh: () => void;
  onExport: () => void;
  isLoading?: boolean;
}

export function AdminAttendanceHeader({
  onOpenManualModal,
  onRefresh,
  onExport,
  isLoading,
}: AdminAttendanceHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attendance Management</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Monitor daily employee attendance, track check-ins/outs, and manage attendance logs.
        </p>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="cursor-pointer"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          className="cursor-pointer"
        >
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
        <Button
          size="sm"
          onClick={onOpenManualModal}
          className="cursor-pointer bg-primary hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Mark Attendance
        </Button>
      </div>
    </div>
  );
}
