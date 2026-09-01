 // types/employee.type.ts

import { Types } from "mongoose";

export interface IEmployeeProfile {
  user: Types.ObjectId;
  phone?: string;
  address?: string;
  profilePicture?: string;
  jobTitle?: string;
  department?: string;
  dateOfJoining?: Date;
  documents?: {
    name: string;
    url: string;
  }[];
}