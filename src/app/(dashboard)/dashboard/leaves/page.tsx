// app/dashboard/leaves/page.tsx

import QuickStatsRow from "@/components/dashboard/leaves/quickstatsrow"
import Header from "@/components/dashboard/leaves/header"
import LeaveBalanceCards from "@/components/dashboard/leaves/leavebalancecard"
import RecentApplications from "@/components/dashboard/leaves/recentapp"



export default function LeavesPage() {
  // Mock data - in real app this would come from API / server component

  /*

  ● Employees can:
○ Select leave type Paid, Sick, Unpaid)
○ Choose date range
○ Add remarks
● Leave request status:
○ Pending
○ Approved
○ Rejected
  */
  
  return (
    
    <div className="container mx-auto py-6 px-4 md:px-6 space-y-8">
      {/* Header */}
      <Header />

      {/* Leave Balance Cards */}
      <LeaveBalanceCards />

      {/* Recent Applications */}
      
      <RecentApplications />

      {/* Quick Stats Row */}
      <QuickStatsRow />
    </div>

   
  )
}









