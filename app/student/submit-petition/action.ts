'use server';

import { createClient } from '@/utils/supabase/server';
import { PetitionSchema } from '@/lib/schemas';

export async function savePetition(petition: PetitionSchema) {
  const supabase = await createClient();

  const userId = (await supabase.auth.getUser()).data.user?.id;

  const { data, error } = await supabase
    .from('petitions')
    .insert([{ ...petition, creator_id: userId }])
    .select()
    .single();

  if (error) {
    return { error };
  }

  return { data };
}
