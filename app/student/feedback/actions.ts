'use server'

import { createClient } from '@/utils/supabase/server'

export async function getMyFeedbacks() {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('feedback')
    .select('*')
    .eq('student_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching feedbacks:', error)
    throw new Error('Failed to fetch feedbacks')
  }

  return data || []
}
