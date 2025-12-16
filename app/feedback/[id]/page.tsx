import { createClient } from '@/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { FeedbackInteraction } from '@/components/feedback-detail/feedback-interaction';
import { FeedbackInfo } from '@/components/feedback-detail/feedback-info';
import { ReplyList } from '@/components/feedback-detail/reply-list';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function FeedbackDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch user profile for role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const isTeacher = profile?.role === 'teacher';

  // Fetch feedback
  const { data: feedback, error } = await supabase
    .from('feedback')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !feedback) {
    notFound();
  }

  // Access control
  if (!isTeacher && feedback.student_id !== user.id) {
    redirect('/'); // Or 403 page
  }

  // Fetch replies
  const { data: replies } = await supabase
    .from('feedback_replies')
    .select('*')
    .eq('feedback_id', id)
    .order('created_at', { ascending: true });

  const isAnswered = (replies && replies.length > 0) || false;

  return (
    <div className="container max-w-3xl py-8 mx-auto">
      <div className="mb-6">
        <Button variant="ghost" asChild className="pl-0 hover:bg-transparent">
          <Link href={isTeacher ? '/teacher/feedbacks' : '/dashboard'}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück zur Übersicht
          </Link>
        </Button>
      </div>

      <FeedbackInfo feedback={feedback} isTeacher={isTeacher} isAnswered={isAnswered} />

      <ReplyList replies={replies || []} />

      <FeedbackInteraction
        feedbackId={feedback.id}
        isTeacher={isTeacher}
        seenByTeacher={feedback.seen_by_teacher}
      />
    </div>
  );
}
