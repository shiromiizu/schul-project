import { getMyFeedbacks } from './actions';
import { FeedbackList } from '@/components/feedback-list';
import { redirect } from 'next/navigation';
import { BackButton } from '@/components/back-button';

export default async function FeedbacksPage() {
  let feedbacks;
  try {
    feedbacks = await getMyFeedbacks();
  } catch (error) {
    // If authentication fails or other error, redirect to login
    redirect('/login');
  }

  return (
    <div className="mx-auto py-8">
      <BackButton className="mb-4" />
      <h1 className="text-3xl font-bold mb-6">Meine Feedbacks</h1>
      <FeedbackList feedbacks={feedbacks} />
    </div>
  );
}
