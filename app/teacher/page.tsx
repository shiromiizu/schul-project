import { fetchPendingPetitions, getRecentFeedbacks } from './actions';
import { DashboardFeedbackList } from '@/components/teacher/dashboard-feedback-list';
import { DashboardPetitionList } from '@/components/teacher/dashboard-petition-list';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function TeacherDashboard() {
  const feedbacks = await getRecentFeedbacks();
  const petitions = await fetchPendingPetitions();

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Lehrer Dashboard</h1>
        <p className="text-muted-foreground">
          Überblick über die neuesten Feedbacks und offenen Petitionen
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 grid-cols-1">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Neueste Feedbacks</CardTitle>
                  <CardDescription className="mt-1">
                    Die letzten eingereichten Rückmeldungen
                  </CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/teacher/feedbacks" className="flex items-center gap-1">
                  Alle
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <DashboardFeedbackList feedbacks={feedbacks} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Offene Petitionen</CardTitle>
                  <CardDescription className="mt-1">Warten auf Ihre Genehmigung</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DashboardPetitionList petitions={petitions} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
