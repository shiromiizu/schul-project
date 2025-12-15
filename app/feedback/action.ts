'use server';

import { createClient } from '@/utils/supabase/server';
import { FeedbackSchema } from '@/lib/schemas';
import {notifyTeacherFeedback, sendMail} from '@/lib/send-mail'

export async function saveFeedback(data: FeedbackSchema) {
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
      ...data,
      student_id: user.id,
    },
  ]);

  if (error) {
    throw new Error('Fehler beim Speichern des Feedbacks: ' + error.message);
  }

  const result = await notifyTeacherFeedback(data);
}
