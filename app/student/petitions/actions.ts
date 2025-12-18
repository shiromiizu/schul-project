'use server';

import { createClient } from '@/utils/supabase/server';
import { PetitionModeration } from '@/lib/types';

export async function fetchStudentPetitions() {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  const { data: petitions, error: petitionsError } = await supabase
    .from('petitions')
    .select('*')
    .eq('creator_id', userId)
    .order('created_at', { ascending: false });

  if (petitionsError) {
    console.error('Error fetching student petitions:', petitionsError);
    throw new Error('Failed to fetch student petitions');
  }

  const rejectedPetitionIds = petitions.filter((p) => p.status === 'rejected').map((p) => p.id);

  let moderationData: PetitionModeration[] = [];

  if (rejectedPetitionIds.length > 0) {
    const { data, error: moderationError } = await supabase
      .from('petition_moderation')
      .select('petition_id, reason, created_at')
      .in('petition_id', rejectedPetitionIds);

    if (!moderationError && data) {
      moderationData = data;
    }
  }

  return petitions.map((petition) => {
    const moderation = moderationData.find((m) => m.petition_id === petition.id);
    return {
      ...petition,
      rejection_reason: moderation?.reason || null,
      rejection_date: moderation?.created_at || null,
    };
  });
}

export async function getMyRecentPetitions() {
  const petitions = await fetchStudentPetitions();
  return petitions.slice(0, 3);
}
