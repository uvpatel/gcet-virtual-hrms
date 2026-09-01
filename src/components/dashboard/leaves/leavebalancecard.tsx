import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"


export default function LeaveBalanceCards() {
  const leaveBalance = [
    { type: "Casual Leave", total: 12, used: 4, color: "bg-emerald-500" },
    { type: "Earned Leave", total: 20, used: 7, color: "bg-blue-500" },
    { type: "Sick Leave", total: 10, used: 1, color: "bg-amber-500" },
    { type: "Optional Holiday", total: 2, used: 0, color: "bg-purple-500" },
  ]
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {leaveBalance.map((leave) => {
          const percentage = (leave.used / leave.total) * 100
          return (
            <Card key={leave.type} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  {leave.type}
                  <Badge variant="outline">{leave.total - leave.used} left</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Used</span>
                    <span className="font-medium">{leave.used} days</span>
                  </div>
                  <Progress value={percentage} className={`h-2 ${leave.color}`} />
                  <div className="text-xs text-muted-foreground">
                    {percentage.toFixed(0)}% utilized
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
  )
}