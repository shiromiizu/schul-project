'use server';

import { createClient } from '@/utils/supabase/server';
import { Petition } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function getRecentFeedbacks() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('feedback')
    .select(
      `
      *,
      feedback_replies(count)
    `
    )
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching feedbacks:', error);
    return [];
  }

  return data.map((f) => ({
    ...f,
    isAnswered: f.feedback_replies?.[0]?.count > 0,
  }));
}

export async function fetchPendingPetitions(): Promise<Petition[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('petitions')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching pending petitions:', error);
    throw new Error('Failed to fetch pending petitions');
  }

  return data;
}

export async function approvePetition(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from('petitions').update({ status: 'approved' }).eq('id', id);

  if (error) {
    console.error('Error approving petition:', error);
    throw new Error('Could not approve petition');
  }

  revalidatePath('/teacher');
}

export async function rejectPetition(id: string, reason: string) {
  const supabase = await createClient();
  const userId = await supabase.auth.getUser().then((user) => user.data.user?.id);

  try {
    await supabase.from('petitions').update({ status: 'rejected' }).eq('id', id);

    await supabase
      .from('petition_moderation')
      .insert({ petition_id: id, moderator_id: userId, reason: reason });
  } catch (error) {
    console.error('Error rejecting petition:', error);
    throw new Error('Could not reject petition');
  }

  revalidatePath('/teacher');
}
