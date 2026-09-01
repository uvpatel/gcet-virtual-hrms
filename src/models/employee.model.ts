import { IEmployeeProfile } from "@/types/employee.type";
import { Schema, model, models, Types } from "mongoose";

const EmployeeProfileSchema = new Schema<IEmployeeProfile>(
  {
    user: { type: Types.ObjectId, ref: "User", required: true, unique: true },
    phone: String,
    address: String,
    profilePicture: String,
    jobTitle: String,
    department: String,
    dateOfJoining: Date,
    documents: [{ name: String, url: String }],
  },
  { timestamps: true }
);

export default models.EmployeeProfile || model<IEmployeeProfile>("EmployeeProfile", EmployeeProfileSchema);