import { Schema, model, models, Types } from "mongoose";

const LeaveSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["paid", "sick", "unpaid"], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    remarks: String,
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    adminComment: String,
    reviewedBy: { type: Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default models.Leave || model("Leave", LeaveSchema);