import { Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {  CalendarDays,Plus,
  FileText} from "lucide-react"
import {  Table,  TableBody,  TableCell,TableHead,TableHeader,TableRow} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"


export default function RecentApplications() {
  const recentApplications = [
    {
      id: "LV-2025-042",
      type: "Casual",
      from: "10 Jan 2025",
      to: "11 Jan 2025",
      days: 2,
      status: "approved",
      applied: "05 Jan 2025",
    },
    {
      id: "LV-2025-038",
      type: "Sick",
      from: "28 Dec 2024",
      to: "29 Dec 2024",
      days: 2,
      status: "approved",
      applied: "27 Dec 2024",
    },
    {
      id: "LV-2025-021",
      type: "Earned",
      from: "15 Dec 2025",
      to: "20 Dec 2025",
      days: 6,
      status: "pending",
      applied: "02 Dec 2024",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 border-emerald-500/30">
            Approved
          </Badge>
        )
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Recent Leave Applications</CardTitle>
            <CardDescription>Last 3 months</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Leave ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Applied On</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentApplications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{app.id}</TableCell>
                    <TableCell>{app.type}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {app.from} — {app.to}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{app.days} day{app.days > 1 ? "s" : ""}</TableCell>
                    <TableCell>{app.applied}</TableCell>
                    <TableCell className="text-right">
                      {getStatusBadge(app.status)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {recentApplications.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              No leave applications found in the recent period
            </div>
          )}
        </CardContent>
      </Card>
  )
}