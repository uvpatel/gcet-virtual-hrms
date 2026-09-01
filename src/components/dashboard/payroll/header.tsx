import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

export default function Header() {
  return(
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payroll</h1>
          <p className="text-muted-foreground">
            View your salary details, payslips and payment history
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Form 16
          </Button>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            View Latest Payslip
          </Button>
        </div>
      </div>
  )
}