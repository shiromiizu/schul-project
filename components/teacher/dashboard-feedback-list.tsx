'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { CategoryRecord } from '@/lib/types';

interface DashboardFeedbackListProps {
  feedbacks: any[]; // Replace with proper type
}

export function DashboardFeedbackList({ feedbacks }: DashboardFeedbackListProps) {
  const getCategoryLabel = (val: string) => {
    const found = Object.values(CategoryRecord).find((c) => c.value === val);
    return found ? found.label : val;
  };

  if (feedbacks.length === 0) {
    return <div className="text-center text-muted-foreground py-8">Keine neuen Feedbacks.</div>;
  }

  return (
    <div className="space-y-4">
      {feedbacks.map((feedback) => (
        <Card key={feedback.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{getCategoryLabel(feedback.category)}</Badge>
                  {feedback.isAnswered && <Badge className="bg-green-500">Beantwortet</Badge>}
                  {!feedback.seen_by_teacher && !feedback.isAnswered && (
                    <Badge variant="secondary">Neu</Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{feedback.title}</CardTitle>
                <CardDescription>
                  {format(new Date(feedback.created_at), 'PPP', { locale: de })}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                variant="ghost"
                asChild
                className="hover:bg-transparent relative after:absolute after:bottom-0 after:left-1/2 after:h-[1px] after:w-0 after:-translate-x-1/2 after:bg-primary after:transition-all after:duration-300 hover:after:w-full px-0"
              >
                <Link href={`/feedback/${feedback.id}`} className={'flex items-center'}>
                  Details
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
