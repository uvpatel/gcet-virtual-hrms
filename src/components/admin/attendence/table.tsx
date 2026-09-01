"use client";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { MoreHorizontal, Clock, Edit2, Trash2, LogOut, CheckCircle2 } from "lucide-react";

export interface AttendanceItem {
  _id: string;
  user: {
    _id: string;
    name?: string;
    email: string;
    role?: string;
    employeeId?: string;
  };
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: "present" | "absent" | "half-day" | "leave";
  createdAt?: string;
}

interface AdminAttendanceTableProps {
  records: AttendanceItem[];
  isLoading: boolean;
  onEdit: (record: AttendanceItem) => void;
  onDelete: (id: string) => void;
  onQuickCheckout: (record: AttendanceItem) => void;
}

export function AdminAttendanceTable({
  records,
  isLoading,
  onEdit,
  onDelete,
  onQuickCheckout,
}: AdminAttendanceTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/30">
            Present
          </Badge>
        );
      case "absent":
        return <Badge variant="destructive">Absent</Badge>;
      case "half-day":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/30">
            Half Day
          </Badge>
        );
      case "leave":
        return <Badge variant="secondary">On Leave</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return "—";
    try {
      const d = new Date(timeStr);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
    } catch {
      return timeStr;
    }
  };

  const calculateHours = (checkIn?: string, checkOut?: string) => {
    if (!checkIn || !checkOut) return "—";
    try {
      const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
      if (diff <= 0) return "—";
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    } catch {
      return "—";
    }
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return email?.substring(0, 2).toUpperCase() || "EM";
  };

  return (
    <Card className="shadow-xs overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[240px]">Employee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Total Hours</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={7} className="h-12 text-center text-muted-foreground animate-pulse">
                      Loading attendance records...
                    </TableCell>
                  </TableRow>
                ))
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    No attendance records found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record) => (
                  <TableRow key={record._id} className="hover:bg-muted/40 transition-colors">
                    {/* Employee Info */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={`https://avatar.vercel.sh/${record.user?.email || "user"}`} />
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {getInitials(record.user?.name, record.user?.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm leading-snug">
                            {record.user?.name || "Unnamed Employee"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {record.user?.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Date */}
                    <TableCell className="text-sm font-medium">
                      {new Date(record.date).toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>

                    {/* Check In */}
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className={record.checkIn ? "font-mono" : "text-muted-foreground"}>
                          {formatTime(record.checkIn)}
                        </span>
                      </div>
                    </TableCell>

                    {/* Check Out */}
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        <LogOut className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className={record.checkOut ? "font-mono" : "text-muted-foreground"}>
                          {formatTime(record.checkOut)}
                        </span>
                      </div>
                    </TableCell>

                    {/* Total Hours */}
                    <TableCell className="text-sm font-mono text-muted-foreground">
                      {calculateHours(record.checkIn, record.checkOut)}
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell>{getStatusBadge(record.status)}</TableCell>

                    {/* Actions Dropdown */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {record.checkIn && !record.checkOut && (
                            <DropdownMenuItem
                              onClick={() => onQuickCheckout(record)}
                              className="cursor-pointer text-emerald-600 focus:text-emerald-600"
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Mark Check-Out
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => onEdit(record)} className="cursor-pointer">
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit Record
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDelete(record._id)}
                            className="cursor-pointer text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Record
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
