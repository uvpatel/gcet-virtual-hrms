import { AttendanceRecord } from "@/types/attendance.type";
import { Schema, model, models, Types } from "mongoose";

const AttendanceSchema = new Schema<AttendanceRecord>(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    checkIn: Date,
    checkOut: Date,
    status: {
      type: String,
      enum: ["present", "absent", "half-day", "leave"],
      default: "present",
    },
  },
  { timestamps: true }
);

AttendanceSchema.index({ user: 1, date: 1 }, { unique: true });

export default models.Attendance || model("Attendance", AttendanceSchema);
