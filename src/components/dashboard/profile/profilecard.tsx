import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Briefcase, 
  Calendar, 
  ShieldCheck, 
  Edit 
} from "lucide-react"



export default function ProfileCard() {

   const { data: session, isPending, error } = authClient.useSession();
  
  return(
    <div className="md:col-span-4 space-y-6">
    <Card className="overflow-hidden">
      <div className="h-32 bg-gradient-to-r from-violet-500/20 to-indigo-500/20" />
      <CardContent className="relative px-6 pb-6 -mt-16">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-32 w-32 border-4 border-background ring-2 ring-violet-500/30 mb-4">
            <AvatarImage src={session?.user?.image ?? " "} alt="Urvil Patel" />
            <AvatarFallback className="text-4xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
              UP
            </AvatarFallback>
          </Avatar>

          <h2 className="text-2xl font-bold">{session?.user?.name ?? "Urvil Patel"}</h2>
          <p className="text-muted-foreground">Software Engineer • DevFlow</p>

          <div className="mt-3 flex flex-wrap gap-2 justify-center">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
              <ShieldCheck className="mr-1 h-3.5 w-3.5" />
              Verified
            </Badge>
            <Badge variant="secondary">Full-Time</Badge>
            <Badge variant="secondary">Remote</Badge>
          </div>
        </div>
      </CardContent >
    </Card>

    {/* Quick Info Cards */}
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Quick Info</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 text-sm">
        <div className="flex items-center gap-3">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="font-medium">Email</p>
            <p className="text-muted-foreground">urvil@example.com</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="font-medium">Phone</p>
            <p className="text-muted-foreground">+91 98765 43210</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="font-medium">Joined</p>
            <p className="text-muted-foreground">March 15, 2023</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
  )
}