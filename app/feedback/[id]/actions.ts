'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function markAsRead(feedbackId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('feedback')
    .update({ seen_by_teacher: true })
    .eq('id', feedbackId);

  if (error) throw error;

  revalidatePath(`/feedback/${feedbackId}`);
}

export async function addReply(feedbackId: string, message: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error: replyError } = await supabase.from('feedback_replies').insert({
    feedback_id: feedbackId,
    teacher_id: user.id,
    message: message,
  });

  if (replyError) throw replyError;

  const { error: updateError } = await supabase
    .from('feedback')
    .update({ seen_by_teacher: true })
    .eq('id', feedbackId);

  if (updateError) throw updateError;

  revalidatePath(`/feedback/${feedbackId}`);
}
