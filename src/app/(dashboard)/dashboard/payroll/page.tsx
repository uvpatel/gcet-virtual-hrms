// app/dashboard/payroll/page.tsx


import QuickStats from "@/components/dashboard/payroll/quickstats"
import Header from "@/components/dashboard/payroll/header"
import PaymentHistory from "@/components/dashboard/payroll/paymenthistory"
import CurrentMonthSummary from "@/components/dashboard/payroll/currentmonthly"
import SalaryBreakdown from "@/components/dashboard/payroll/salarybreakdown"







export default function PayrollPage() {
  // Mock data - in real app → fetch from API / server component

  //  Payroll data is read-only for employees.
  
  return (
   
    <div className="container mx-auto py-6 px-4 md:px-6 space-y-8">
      {/* Header */}
      <Header />

      {/* Current Month Summary */}
     <CurrentMonthSummary />

      {/* Salary Breakdown */}
      <SalaryBreakdown />

      {/* Payment History */}
     <PaymentHistory />

      {/* Quick Stats */}
      <QuickStats />
    </div>
    
  )
}











