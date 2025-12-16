import LinkCard from '@/components/ui/link-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, FileText } from 'lucide-react';

const recentFeedback = [
  {
    id: 1,
    title: 'Fehler im Checkout-Prozess',
    description: 'Der Zahlungsbutton reagiert nicht auf mobilen Geräten',
    status: 'new' as const,
    date: '2024-01-15',
    category: 'Fehlermeldung',
  },
  {
    id: 2,
    title: 'Funktionswunsch: Dunkelmodus',
    description: 'Es wäre toll, eine Dunkelmodus-Option für das Dashboard zu haben',
    status: 'seen' as const,
    date: '2024-01-14',
    category: 'Funktionswunsch',
  },
  {
    id: 3,
    title: 'Vorschlag für verbesserte Navigation',
    description: 'Das Hauptmenü könnte mit besseren Beschriftungen intuitiver sein',
    status: 'answered' as const,
    date: '2024-01-13',
    category: 'Vorschlag',
  },
];

const statusConfig = {
  new: {
    label: 'Neu',
    color: 'bg-blue-500',
  },
  seen: {
    label: 'Gesehen',
    color: 'bg-amber-500',
  },
  answered: {
    label: 'Beantwortet',
    color: 'bg-green-500',
  },
};

const StudentDashboardComponent = () => {
  return (
    <div className="w-4/5 mx-auto my-8">
      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold">Feedback-Dashboard</h1>
          <p className="text-muted-foreground">
            Verfolgen und verwalten Sie Ihre Feedback-Einreichungen
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <LinkCard
            href="/submit-feedback"
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
            <CardTitle>Aktuelles Feedback</CardTitle>
            <CardDescription>Ihre letzten 3 eingereichten Feedbacks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentFeedback.map((feedback) => {
              const status = statusConfig[feedback.status];

              return (
                <Card key={feedback.id} className="border">
                  <CardContent className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{feedback.title}</h3>
                      <p className="text-sm text-muted-foreground">{feedback.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge>{feedback.category}</Badge>
                        <time className="text-xs text-muted-foreground">
                          {new Date(feedback.date).toLocaleDateString('de-DE', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </time>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${status.color}`} />
                      <Badge>{status.label}</Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-2">
            <span className="text-sm font-medium">Status-Legende:</span>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm">Neu - Wartet auf Überprüfung</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-sm">Gesehen - Wird überprüft</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm">Beantwortet - Antwort bereitgestellt</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboardComponent;
