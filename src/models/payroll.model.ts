import { Schema, model, models, Types } from "mongoose";

const PayrollSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    baseSalary: { type: Number, required: true },
    allowances: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    month: String, // "2026-09"
    slipUrl: String,
  },
  { timestamps: true }
);

export default models.Payroll || model("Payroll", PayrollSchema);