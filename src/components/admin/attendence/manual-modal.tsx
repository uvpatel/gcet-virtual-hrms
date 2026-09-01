"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface EmployeeOption {
  _id: string;
  name?: string;
  email: string;
  role?: string;
}

interface AdminManualAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: EmployeeOption[];
  onSuccess: () => void;
}

export function AdminManualAttendanceModal({
  isOpen,
  onClose,
  employees,
  onSuccess,
}: AdminManualAttendanceModalProps) {
  const [selectedUser, setSelectedUser] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [checkInTime, setCheckInTime] = useState("09:00");
  const [checkOutTime, setCheckOutTime] = useState("18:00");
  const [status, setStatus] = useState<"present" | "absent" | "half-day" | "leave">("present");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUser) {
      toast.error("Please select an employee");
      return;
    }

    setIsSubmitting(true);

    try {
      let fullCheckIn: string | undefined;
      let fullCheckOut: string | undefined;

      if (status === "present" || status === "half-day") {
        if (checkInTime) {
          fullCheckIn = new Date(`${date}T${checkInTime}:00`).toISOString();
        }
        if (checkOutTime) {
          fullCheckOut = new Date(`${date}T${checkOutTime}:00`).toISOString();
        }
      }

      const res = await fetch("/api/attendance", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: selectedUser,
          date: new Date(date).toISOString(),
          checkIn: fullCheckIn,
          checkOut: fullCheckOut,
          status,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to mark attendance");
      }

      toast.success("Attendance marked successfully");
      onSuccess();
      onClose();
      // Reset form
      setSelectedUser("");
    } catch (err: any) {
      toast.error(err.message || "Failed to mark attendance");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Mark Manual Attendance</DialogTitle>
            <DialogDescription>
              Record or override attendance for an employee on a specified date.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Employee Selection */}
            <div className="space-y-1.5">
              <Label htmlFor="employee-select">Employee *</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser} required>
                <SelectTrigger id="employee-select" className="w-full">
                  <SelectValue placeholder="Select an employee" />
                </SelectTrigger>
                <SelectContent className="max-h-56">
                  {employees.map((emp) => (
                    <SelectItem key={emp._id} value={emp._id}>
                      {emp.name ? `${emp.name} (${emp.email})` : emp.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <Label htmlFor="attendance-date">Date *</Label>
              <Input
                id="attendance-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <Label htmlFor="attendance-status">Status *</Label>
              <Select
                value={status}
                onValueChange={(val: any) => setStatus(val)}
              >
                <SelectTrigger id="attendance-status" className="w-full">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="half-day">Half Day</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Check-In and Check-Out Time */}
            {(status === "present" || status === "half-day") && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="checkin-time">Check In Time</Label>
                  <Input
                    id="checkin-time"
                    type="time"
                    value={checkInTime}
                    onChange={(e) => setCheckInTime(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="checkout-time">Check Out Time</Label>
                  <Input
                    id="checkout-time"
                    type="time"
                    value={checkOutTime}
                    onChange={(e) => setCheckOutTime(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Attendance"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
