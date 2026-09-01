import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return(
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leave Management</h1>
          <p className="text-muted-foreground">
            View your leave balance and track your leave applications
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Apply for Leave
        </Button>
      </div>
  )
}