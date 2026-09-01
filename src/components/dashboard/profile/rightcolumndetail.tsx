import { CardContent, CardHeader } from "@/components/ui/card";
import { Card, CardDescription, CardTitle } from "@/components/ui/card-hover-effect";


export default function RightColumnDetails(){
  return(
    <div className="md:col-span-8 space-y-6">
    {/* Personal Information */}
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Core details about you</CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Full Name</p>
          <p>Urvil Patel</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Employee ID</p>
          <p>DEVF-2023-078</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Department</p>
          <p>Engineering</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Designation</p>
          <p>Software Engineer</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Reporting To</p>
          <p>Senior Tech Lead - Rahul Sharma</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Work Location</p>
          <p>Remote • Anand, Gujarat</p>
        </div>
      </CardContent>
    </Card>

    {/* Additional Cards - you can extend */}
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Leave Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Casual Leave</span>
              <span className="font-medium">12 days</span>
            </div>
            <div className="flex justify-between">
              <span>Earned Leave</span>
              <span className="font-medium">18 days</span>
            </div>
            <div className="flex justify-between">
              <span>Sick Leave</span>
              <span className="font-medium">8 days</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between">
              <span>Applied for leave</span>
              <span className="text-muted-foreground">2 days ago</span>
            </li>
            <li className="flex justify-between">
              <span>Updated profile picture</span>
              <span className="text-muted-foreground">1 week ago</span>
            </li>
            <li className="flex justify-between">
              <span>Completed onboarding task</span>
              <span className="text-muted-foreground">3 weeks ago</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  </div>
  )
}