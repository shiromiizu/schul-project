'use server';

import { createClient } from '@/utils/supabase/server';

export async function fetchApprovedPetitions() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('petitions')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching approved petitions:', error);
    throw new Error('Failed to fetch approved petitions');
  }

  return data;
}

export async function fetchPetitionScoreById(petitionId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('petition_ranking')
    .select('score')
    .eq('id', petitionId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching petition score:', error);
    throw new Error('Failed to fetch petition score');
  }

  return data;
}

export async function postPetitionVote(petitionId: string, vote: number) {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('petition_votes')
    .upsert(
      { petition_id: petitionId, voter_id: userId, vote: vote },
      { onConflict: 'petition_id,voter_id' }
    );

  if (error) {
    console.error('Error posting petition vote:', error);
    throw new Error('Failed to post petition vote');
  }

  return data;
}

export async function fetchUserVote(petitionId: string) {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;

  const { data, error } = await supabase
    .from('petition_votes')
    .select('vote')
    .eq('petition_id', petitionId)
    .eq('voter_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user vote:', error);
    throw new Error('Failed to fetch user vote');
  }

  return data;
}

export async function deleteUserVote(petitionId: string) {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;

  const { data, error } = await supabase
    .from('petition_votes')
    .delete()
    .eq('petition_id', petitionId)
    .eq('voter_id', userId);

  if (error) {
    console.error('Error deleting user vote:', error);
    throw new Error('Failed to delete user vote');
  }

  return data;
}
