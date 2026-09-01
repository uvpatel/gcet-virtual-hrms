// app/dashboard/profile/page.tsx
"use client";



import Header from "@/components/dashboard/profile/header";
import ProfileCard from "@/components/dashboard/profile/profilecard";
import RightColumnDetails from "@/components/dashboard/profile/rightcolumndetail";

export default function ProfilePage() {
 /*
 3.3 Employee Profile Management
3.3.1 View Profile
● Employees can view:
○ Personal details
○ Job details
○ Salary structure
○ Documents
○ Profile picture
3.3.2 Edit Profile
● Employees can edit limited fields (address, phone, profile picture).
● Admin can edit all employee details.
 */
  return (
   

    
    <div className="container mx-auto py-6 px-4 md:px-6 space-y-8">
      {/* Header + Quick Actions */}
      <Header />

      <div className="grid gap-6 md:grid-cols-12">
        {/* Left Column - Profile Card */}
          <ProfileCard />      

        {/* Right Column - Details */}
       <RightColumnDetails />
      </div>
    </div>


  )
}







