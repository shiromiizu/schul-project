'use client';

import { Petition } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Clock, User, X } from 'lucide-react';
import { approvePetition, rejectPetition } from '@/app/teacher/actions';
import { toast } from 'sonner';
import { RejectPetitionDialog } from './reject-petition-dialog';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface DashboardPetitionListProps {
  petitions: Petition[];
}

export function DashboardPetitionList({ petitions }: DashboardPetitionListProps) {
  const handleApprove = async (id: string) => {
    try {
      await approvePetition(id);
      toast.success('Petition angenommen und veröffentlicht');
    } catch (error) {
      toast.error('Fehler beim Annehmen der Petition');
    }
  };

  const handleReject = async (id: string, reason: string) => {
    try {
      await rejectPetition(id, reason);
      toast.success('Petition abgelehnt');
    } catch (error) {
      toast.error('Fehler beim Ablehnen der Petition');
    }
  };

  if (petitions.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12 border-2 border-dashed rounded-lg">
        <p className="text-sm">Keine offenen Petitionen.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {petitions.map((petition) => (
        <Card key={petition.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="space-y-2">
              <CardTitle className="text-base font-semibold">{petition.title}</CardTitle>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{format(new Date(petition.created_at), 'PPP', { locale: de })}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground line-clamp-2">{petition.description}</p>
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button
                size="sm"
                onClick={() => handleApprove(petition.id)}
                className="bg-green-600 hover:bg-green-700 flex"
              >
                <Check className="mr-2 h-4 w-4" />
                Annehmen
              </Button>

              <RejectPetitionDialog
                petitionId={petition.id}
                onReject={handleReject}
                trigger={
                  <Button size="sm" variant="destructive" className="flex">
                    <X className="mr-2 h-4 w-4" />
                    Ablehnen
                  </Button>
                }
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
