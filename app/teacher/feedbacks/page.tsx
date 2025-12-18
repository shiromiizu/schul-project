import { createClient } from '@/utils/supabase/server';
import { requireRole } from '@/utils/auth';
import { FeedbackFilters } from '@/components/teacher/feedback-filters';
import { FeedbackList } from '@/components/feedback-list';
import { BackButton } from '@/components/back-button';

interface PageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    hideAnswered?: string;
  }>;
}

export default async function TeacherFeedbacksPage({ searchParams }: PageProps) {
  await requireRole('teacher');

  const params = await searchParams;
  const category = params.category || 'all';
  const sort = params.sort || 'oldest';
  const hideAnswered = params.hideAnswered !== 'false';

  const supabase = await createClient();

  let query = supabase.from('feedback').select('*, feedback_replies(count)');

  if (category !== 'all') {
    query = query.eq('category', category);
  }

  query = query.order('created_at', { ascending: sort === 'oldest' });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching feedbacks:', error);
    return <div>Fehler beim Laden der Feedbacks.</div>;
  }

  let feedbacks = data || [];

  if (hideAnswered) {
    feedbacks = feedbacks.filter((f) => {
      const replyCount = f.feedback_replies?.[0]?.count || 0;
      return replyCount === 0;
    });
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <BackButton className="mb-4" />
      <h1 className="text-3xl font-bold mb-8">Feedback Übersicht</h1>

      <FeedbackFilters />

      <FeedbackList feedbacks={feedbacks} />
    </div>
  );
}
