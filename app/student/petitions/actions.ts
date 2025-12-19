'use server';

import { createClient } from '@/utils/supabase/server';
import { PetitionModeration } from '@/lib/types';
import { revalidatePath } from 'next/cache';

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

export async function deletePetition(petitionId: string) {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  // Prüfe, ob die Petition dem User gehört und abgelehnt ist
  const { data: petition, error: fetchError } = await supabase
    .from('petitions')
    .select('creator_id, status')
    .eq('id', petitionId)
    .single();

  if (fetchError || !petition) {
    throw new Error('Petition not found');
  }

  if (petition.creator_id !== userId) {
    throw new Error('Unauthorized: You can only delete your own petitions');
  }

  if (petition.status !== 'rejected') {
    throw new Error('Only rejected petitions can be deleted');
  }

  // Lösche die Petition
  const { error: deleteError } = await supabase.from('petitions').delete().eq('id', petitionId);

  if (deleteError) {
    console.error('Error deleting petition:', deleteError);
    throw new Error('Failed to delete petition');
  }

  revalidatePath('/student/petitions');
  revalidatePath('/student');

  return { success: true };
}
