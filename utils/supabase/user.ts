'use server'

import { createClient } from "@/utils/supabase/server"
import { User } from "@supabase/supabase-js"

export async function getUser(): Promise<User | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getRole(): Promise<string | null> {
  const user = await getUser()
  if (!user) return null

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  return profile?.role || null
}
