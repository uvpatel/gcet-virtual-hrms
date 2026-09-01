import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"



export default function CurrentMonthSummary() {
    const currentPayslip = {
  period: "January 2026",
  gross: 92500,
  deductions: 14820,
  netPay: 77680,
  status: "processed",
  payoutDate: "31 Jan 2026",
}
 
  return(
    <Card className="border-emerald-200 bg-emerald-50/30 dark:bg-emerald-950/20">
    <CardHeader className="pb-4">
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-xl">January 2026 Salary</CardTitle>
          <CardDescription>Payout on 31st January 2026</CardDescription>
        </div>
        <Badge
          variant="outline"
          className="text-lg px-4 py-1.5 bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900 dark:text-emerald-300 dark:border-emerald-700"
        >
          ₹{currentPayslip.netPay.toLocaleString("en-IN")}
        </Badge>
      </div>
    </CardHeader>
    <CardContent>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Gross Pay</p>
          <p className="text-2xl font-bold">
            ₹{currentPayslip.gross.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Deductions</p>
          <p className="text-2xl font-bold text-rose-600">
            ₹{currentPayslip.deductions.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Net Pay</p>
          <p className="text-2xl font-bold text-emerald-600">
            ₹{currentPayslip.netPay.toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
  )
}