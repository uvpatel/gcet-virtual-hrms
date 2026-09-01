import { Types } from "mongoose";

export interface AttendanceRecord {
user: Types.ObjectId;
  date: Date;
  checkIn?: Date;
  checkOut?: Date;
  status: "present" | "absent" | "leave";
  checkInTime?: Date;
  checkOutTime?: Date;
}