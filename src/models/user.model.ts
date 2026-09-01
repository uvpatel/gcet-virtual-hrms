import { IUser } from "@/types/user.type";
import { Schema, model, models } from "mongoose";

const UserSchema = new Schema<IUser>(
  {
    name: String,
    email: { type: String, unique: true, required: true },
    emailVerified: { type: Boolean, default: false },
    role: { type: String, enum: ["admin", "employee", "manager" , "hr"], default: "employee" },
    employeeId: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

export default models.User || model<IUser>("User", UserSchema);