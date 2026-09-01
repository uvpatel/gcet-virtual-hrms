import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Download } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function PaymentHistory() {
  const recentPayslips = [
    { month: "Dec 2025", netPay: 76850, status: "paid", date: "31 Dec 2025" },
    { month: "Nov 2025", netPay: 78240, status: "paid", date: "30 Nov 2025" },
    { month: "Oct 2025", netPay: 77500, status: "paid", date: "31 Oct 2025" },
    { month: "Sep 2025", netPay: 81000, status: "paid", date: "30 Sep 2025" },
  ]
  return(
    <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0">
      <div>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>Last 6 months</CardDescription>
      </div>
      <Button variant="outline" size="sm">
        <Download className="mr-2 h-4 w-4" />
        Export CSV
      </Button>
    </CardHeader>
    <CardContent>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead>Net Pay</TableHead>
              <TableHead>Payout Date</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentPayslips.map((slip) => (
              <TableRow key={slip.month}>
                <TableCell className="font-medium">{slip.month}</TableCell>
                <TableCell>₹{slip.netPay.toLocaleString("en-IN")}</TableCell>
                <TableCell>{slip.date}</TableCell>
                <TableCell className="text-right">
                  <Badge className="bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 border-emerald-500/30">
                    Paid
                  </Badge>
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