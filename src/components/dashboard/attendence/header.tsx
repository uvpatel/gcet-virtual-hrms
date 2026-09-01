import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function Header() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
        <p className="text-muted-foreground">
          Track your daily check-in/check-out and attendance history
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button>Mark Attendance</Button>
      </div>
    </div>
  )
}