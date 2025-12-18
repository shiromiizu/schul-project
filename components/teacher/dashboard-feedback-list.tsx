'use client';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { CategoryRecord } from '@/lib/types';

interface Feedback {
  id: string;
  title: string;
  category: string;
  created_at: string;
  isAnswered?: boolean;
  seen_by_teacher?: boolean;
}

interface DashboardFeedbackListProps {
  feedbacks: Feedback[];
}

export function DashboardFeedbackList({ feedbacks }: DashboardFeedbackListProps) {
  const getCategoryLabel = (val: string) => {
    const found = Object.values(CategoryRecord).find((c) => c.value === val);
    return found ? found.label : val;
  };

  if (feedbacks.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12 border-2 border-dashed rounded-lg">
        <p className="text-sm">Keine neuen Feedbacks.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {feedbacks.map((feedback) => (
        <Card key={feedback.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="shrink-0">
                    {getCategoryLabel(feedback.category)}
                  </Badge>
                  {feedback.isAnswered && (
                    <Badge className="bg-green-500 hover:bg-green-600 shrink-0">Beantwortet</Badge>
                  )}
                  {!feedback.seen_by_teacher && !feedback.isAnswered && (
                    <Badge variant="secondary" className="shrink-0">
                      Neu
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-base font-semibold truncate">{feedback.title}</CardTitle>
                <CardDescription className="flex items-center gap-1 text-xs">
                  <Clock className="h-3 w-3" />
                  {format(new Date(feedback.created_at), 'PPP', { locale: de })}
                </CardDescription>
              </div>
              <Button size="sm" variant="ghost" asChild className="shrink-0">
                <Link href={`/feedback/${feedback.id}`} className="flex items-center gap-1">
                  Details
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
