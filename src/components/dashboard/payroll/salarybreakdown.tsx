import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  DollarSign,
  Calendar,
  Download,
  FileText,
  TrendingUp,
  Clock,
  AlertCircle,
} from "lucide-react"


export default function SalaryBreakdown() {
    const currentPayslip = {
  period: "January 2026",
  gross: 92500,
  deductions: 14820,
  netPay: 77680,
  status: "processed",
  payoutDate: "31 Jan 2026",
}

  const salaryBreakdown = [
    { label: "Basic Salary", amount: 52000, type: "earning" },
    { label: "HRA", amount: 20800, type: "earning" },
    { label: "Special Allowance", amount: 14000, type: "earning" },
    { label: "Performance Bonus", amount: 5700, type: "earning" },
    { label: "PF Contribution", amount: -6240, type: "deduction" },
    { label: "Professional Tax", amount: -200, type: "deduction" },
    { label: "Income Tax", amount: -7380, type: "deduction" },
    { label: "Insurance", amount: -1000, type: "deduction" },
  ]
  

  return(
    <Card>
        <CardHeader>
          <CardTitle>Salary Breakdown - January 2026</CardTitle>
          <CardDescription>Component wise details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {salaryBreakdown.map((item, i) => (
              <div key={i} className="flex justify-between items-center py-1">
                <div className="flex items-center gap-3">
                  {item.type === "earning" ? (
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-rose-600" />
                  )}
                  <span>{item.label}</span>
                </div>
                <span
                  className={
                    item.type === "earning"
                      ? "font-medium text-emerald-600"
                      : "font-medium text-rose-600"
                  }
                >
                  {item.type === "earning" ? "+" : "-"}₹
                  {Math.abs(item.amount).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
            <div className="border-t pt-4 mt-2">
              <div className="flex justify-between font-bold text-lg">
                <span>Net Salary</span>
                <span className="text-emerald-600">
                  ₹{currentPayslip.netPay.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
  )
}