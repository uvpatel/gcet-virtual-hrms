"use client";

import { useState, useEffect } from "react";
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
import { AttendanceItem } from "./table";

interface AdminEditAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: AttendanceItem | null;
  onSuccess: () => void;
}

export function AdminEditAttendanceModal({
  isOpen,
  onClose,
  record,
  onSuccess,
}: AdminEditAttendanceModalProps) {
  const [date, setDate] = useState("");
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [status, setStatus] = useState<"present" | "absent" | "half-day" | "leave">("present");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (record) {
      setDate(new Date(record.date).toISOString().split("T")[0]);
      setStatus(record.status || "present");

      if (record.checkIn) {
        const d = new Date(record.checkIn);
        const hours = String(d.getHours()).padStart(2, "0");
        const mins = String(d.getMinutes()).padStart(2, "0");
        setCheckInTime(`${hours}:${mins}`);
      } else {
        setCheckInTime("");
      }

      if (record.checkOut) {
        const d = new Date(record.checkOut);
        const hours = String(d.getHours()).padStart(2, "0");
        const mins = String(d.getMinutes()).padStart(2, "0");
        setCheckOutTime(`${hours}:${mins}`);
      } else {
        setCheckOutTime("");
      }
    }
  }, [record]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!record) return;

    setIsSubmitting(true);

    try {
      let fullCheckIn: string | null = null;
      let fullCheckOut: string | null = null;

      if (checkInTime) {
        fullCheckIn = new Date(`${date}T${checkInTime}:00`).toISOString();
      }
      if (checkOutTime) {
        fullCheckOut = new Date(`${date}T${checkOutTime}:00`).toISOString();
      }

      const res = await fetch(`/api/attendance/${record._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: new Date(date).toISOString(),
          checkIn: fullCheckIn,
          checkOut: fullCheckOut,
          status,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to update attendance record");
      }

      toast.success("Attendance record updated successfully");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to update attendance record");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!record) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Attendance Record</DialogTitle>
            <DialogDescription>
              Update check-in, check-out, or status for {record.user?.name || record.user?.email}.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Date */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-date">Date</Label>
              <Input
                id="edit-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={status}
                onValueChange={(val: any) => setStatus(val)}
              >
                <SelectTrigger id="edit-status" className="w-full">
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
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-checkin">Check In Time</Label>
                <Input
                  id="edit-checkin"
                  type="time"
                  value={checkInTime}
                  onChange={(e) => setCheckInTime(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-checkout">Check Out Time</Label>
                <Input
                  id="edit-checkout"
                  type="time"
                  value={checkOutTime}
                  onChange={(e) => setCheckOutTime(e.target.value)}
                />
              </div>
            </div>
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
                  Updating...
                </>
              ) : (
                "Update Record"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
