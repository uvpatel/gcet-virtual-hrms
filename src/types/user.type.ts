export interface IUser {
    name: string;
    email: string;
    emailVerified: boolean;
    role: "admin" | "employee" | "manager" | "hr";
    employeeId?: string;
}