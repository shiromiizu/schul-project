import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getRecentFeedbacks, getRecentPetitions } from "./actions"
import { DashboardFeedbackList } from "@/components/teacher/dashboard-feedback-list"
import { DashboardPetitionList } from "@/components/teacher/dashboard-petition-list"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default async function TeacherDashboard() {
  const feedbacks = await getRecentFeedbacks()
  const petitions = await getRecentPetitions()

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Lehrer Dashboard</h1>
      
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Feedbacks Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Neueste Feedbacks</h2>
            <Button variant="ghost" asChild>
              <Link href="/teacher/feedbacks">
                Alle anzeigen
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <DashboardFeedbackList feedbacks={feedbacks} />
        </div>

        {/* Petitions Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Offene Petitionen</h2>
            {/* Link to all petitions could go here */}
          </div>
          <DashboardPetitionList petitions={petitions} />
        </div>
      </div>
    </div>
  )
}
