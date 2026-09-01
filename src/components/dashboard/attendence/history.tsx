import { Badge } from "@/components/ui/badge"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"


import {

  Clock,
  Download
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function AttendanceHistory() {
  const mockAttendance = [
    { date: "2025-01-10", checkIn: "09:02", checkOut: "18:15", status: "present", late: true },
    { date: "2025-01-09", checkIn: "08:55", checkOut: "18:10", status: "present", late: false },
    { date: "2025-01-08", checkIn: "-", checkOut: "-", status: "absent", late: false },
    { date: "2025-01-07", checkIn: "09:12", checkOut: "17:45", status: "present", late: true },
    { date: "2025-01-06", checkIn: "08:48", checkOut: "18:30", status: "present", late: false },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/30">Present</Badge>
      case "absent":
        return <Badge variant="destructive">Absent</Badge>
      case "half-day":
        return <Badge variant="secondary">Half Day</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance History</CardTitle>
        <CardDescription>January 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAttendance.map((record, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">
                    {new Date(record.date).toLocaleDateString('en-IN', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short'
                    })}
                  </TableCell>
                  <TableCell>
                    {record.checkIn === "-" ? (
                      <span className="text-muted-foreground">—</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {record.checkIn}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {record.checkOut === "-" ? (
                      <span className="text-muted-foreground">—</span>
                    ) : record.checkOut}
                  </TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                  <TableCell className="text-right">
                    {record.late && (
                      <Badge variant="outline" className="border-amber-500/50 text-amber-700">
                        Late
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
