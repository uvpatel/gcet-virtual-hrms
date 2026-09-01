export interface AdminAttendanceStatsProps {
  totalEmployees: number;
  presentCount: number;
  absentCount: number;
  leaveCount: number;
  halfDayCount: number;
  isLoading?: boolean;
}