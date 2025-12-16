'use server';

import { createClient } from '@/utils/supabase/server';
import { FeedbackSchema } from '@/lib/schemas';
import { notifyTeacherFeedback } from '@/lib/send-mail';

export async function saveFeedback(feedbackData: FeedbackSchema) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('Nicht authentifiziert');
  }

  const { error } = await supabase.from('feedback').insert([
    {
      ...feedbackData,
      student_id: user.id,
    },
  ]);

  await notifyTeacherFeedback(feedbackData);

  return { feedbackData, error };
}
