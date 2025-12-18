import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CategoryRecord } from '@/lib/types';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Building2, CheckCircle2, Clock3, GraduationCap, Tag } from 'lucide-react';

type Feedback = {
  id: string;
  category: string;
  title: string;
  description: string;
  created_at: string;
  seen_by_teacher: boolean;
};

interface FeedbackListProps {
  feedbacks: Feedback[];
}

export function FeedbackList({ feedbacks }: FeedbackListProps) {
  const getCategoryLabel = (categoryValue: string) => {
    const category = Object.values(CategoryRecord).find((c) => c.value === categoryValue);
    return category ? category.label : categoryValue;
  };

  const getCategoryColor = (categoryValue: string) => {
    switch (categoryValue) {
      case CategoryRecord.TEACHER.value:
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200';
      case CategoryRecord.BUILDING.value:
        return 'bg-[#A37774] text-white hover:bg-[#A37774]/90 border-[#A37774]';
      default:
        return 'bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-200';
    }
  };

  const getCategoryIcon = (categoryValue: string) => {
    switch (categoryValue) {
      case CategoryRecord.TEACHER.value:
        return <GraduationCap className="w-3 h-3 mr-1" />;
      case CategoryRecord.BUILDING.value:
        return <Building2 className="w-3 h-3 mr-1" />;
      default:
        return <Tag className="w-3 h-3 mr-1" />;
    }
  };

  if (feedbacks.length === 0) {
    return <div className="text-center text-muted-foreground py-8">Keine Feedbacks gefunden.</div>;
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {feedbacks.map((feedback) => (
        <Link key={feedback.id} href={`/feedback/${feedback.id}`} className="block h-full">
          <Card className={cn('h-full hover:shadow-md transition-shadow')}>
            <CardHeader className="pb-2 pt-6">
              <div className="flex flex-col items-start gap-1.5">
                <CardTitle className="text-lg font-semibold leading-none tracking-tight">
                  {feedback.title}
                </CardTitle>

                <CardDescription className="text-xs">
                  {new Date(feedback.created_at).toLocaleDateString('de-DE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground line-clamp-1">{feedback.description}</p>
            </CardContent>
            <CardFooter className={'flex gap-2'}>
              <Badge className={cn(getCategoryColor(feedback.category))}>
                {getCategoryIcon(feedback.category)}
                {getCategoryLabel(feedback.category)}
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  'whitespace-nowrap border-transparent z-10',
                  feedback.seen_by_teacher
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                )}
              >
                {feedback.seen_by_teacher ? (
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                ) : (
                  <Clock3 className="w-3 h-3 mr-1" />
                )}
                {feedback.seen_by_teacher ? 'Gesehen' : 'Offen'}
              </Badge>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
