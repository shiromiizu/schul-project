'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertCircle, CheckCircle, HourglassIcon } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface PetitionWithReason {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  rejection_reason?: string | null;
  rejection_date?: string | null;
}

interface StudentPetitionsListProps {
  petitions: PetitionWithReason[];
}

const statusConfig = {
  pending: {
    label: 'Ausstehend',
    icon: HourglassIcon,
    variant: 'secondary' as const,
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  },
  approved: {
    label: 'Genehmigt',
    icon: CheckCircle,
    variant: 'default' as const,
    className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
  rejected: {
    label: 'Abgelehnt',
    icon: AlertCircle,
    variant: 'destructive' as const,
    className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  },
};

export function StudentPetitionsList({ petitions }: StudentPetitionsListProps) {
  if (petitions.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12 border-2 border-dashed rounded-lg">
        <p className="text-sm">Sie haben noch keine Petitionen eingereicht.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {petitions.map((petition) => {
        const config = statusConfig[petition.status];
        const StatusIcon = config.icon;

        return (
          <Card key={petition.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge className={cn('flex items-center gap-1', config.className)}>
                      <StatusIcon className="h-3 w-3" />
                      {config.label}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-semibold">{petition.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1 text-xs">
                    <Clock className="h-3 w-3" />
                    Eingereicht am {format(new Date(petition.created_at), 'PPP', { locale: de })}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{petition.description}</p>

              {petition.status === 'rejected' && petition.rejection_reason && (
                <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-medium text-destructive">Ablehnungsgrund:</p>
                      <p className="text-sm text-muted-foreground">{petition.rejection_reason}</p>
                      {petition.rejection_date && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Abgelehnt am {format(new Date(petition.rejection_date), 'PPP', { locale: de })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {petition.status === 'approved' && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        Ihre Petition wurde genehmigt und ist jetzt öffentlich sichtbar!
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Andere Schüler können jetzt für Ihre Petition abstimmen.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {petition.status === 'pending' && (
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="flex items-start gap-2">
                    <HourglassIcon className="h-4 w-4 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Ihre Petition wird geprüft
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Ein Lehrer wird Ihre Petition bald überprüfen und freigeben oder ablehnen.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

