"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw, Calendar } from "lucide-react";

interface AdminAttendanceFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  selectedDate: string;
  onDateChange: (value: string) => void;
  onReset: () => void;
}

export function AdminAttendanceFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  selectedDate,
  onDateChange,
  onReset,
}: AdminAttendanceFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-card p-4 rounded-lg border shadow-xs">
      <div className="flex flex-1 flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or ID..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-[160px]">
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger className="h-9 w-full">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="present">Present</SelectItem>
              <SelectItem value="absent">Absent</SelectItem>
              <SelectItem value="half-day">Half Day</SelectItem>
              <SelectItem value="leave">Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Filter */}
        <div className="relative w-full sm:w-[170px]">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="h-9 text-xs"
          />
        </div>
      </div>

      {/* Reset */}
      {(search || status !== "all" || selectedDate) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-9 px-3 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
          Reset
        </Button>
      )}
    </div>
  );
}
