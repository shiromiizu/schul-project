import LinkCard from '@/components/ui/link-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CheckCircle, Clock, FileText, MessageSquare } from 'lucide-react';
import { Feedback } from '@/lib/types';
import Link from 'next/link';

type Props = {
  feedbacks: Feedback[];
};

const StudentDashboard = ({ feedbacks }: Props) => {
  return (
    <div className="w-4/5 mx-auto my-6">
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 text-center">
          <LinkCard
            href="/student/submit-feedback"
            icon={MessageSquare}
            title="Feedback einreichen"
            description="Teilen Sie uns Ihre Meinung mit"
          />
          <LinkCard
            href="/dashboard/petitions"
            icon={FileText}
            title="Petitionen ansehen"
            description="Durchsuchen und unterstützen Sie Petitionen"
          />
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between px-2">
              <div className={'flex flex-col space-y-2'}>
                <CardTitle>Ihre zuletzt eingereichten Feedbacks</CardTitle>
              </div>
              <Link
                href="/student/feedback"
                className="text-sm font-medium text-primary hover:underline flex items-center gap-1 group"
              >
                Alle anzeigen
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {feedbacks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Noch kein Feedback eingereicht</p>
              </div>
            ) : (
              feedbacks.map((feedback, index) => {
                if (index >= 3) return;
                const isOpen = !feedback.seenByTeacher;
                return (
                  <Link key={feedback.id} href={`/feedback/${feedback.id}`} className="block">
                    <Card className="border hover:shadow-md transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div className="flex-1 space-y-3 overflow-hidden">
                            <div className="flex items-start justify-between gap-3">
                              <h3 className="text-lg font-semibold leading-tight">
                                {feedback.title}
                              </h3>
                              {isOpen ? (
                                <Badge
                                  variant="outline"
                                  className="flex items-center gap-1.5 bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800 whitespace-nowrap"
                                >
                                  <Clock className="w-3 h-3" />
                                  Offen
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="flex items-center gap-1.5 bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800 whitespace-nowrap"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  Gesehen
                                </Badge>
                              )}
                            </div>

                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {feedback.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {feedback.category}
                              </Badge>
                              <span className="text-muted-foreground">•</span>
                              <time className="text-xs text-muted-foreground">
                                {new Date(feedback.created_at).toLocaleDateString('de-DE', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </time>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
