import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function getUserRole() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return profile?.role;
}

export async function requireRole(role: "teacher" | "admin" | "student") {
  const userRole = await getUserRole();
  if (userRole !== role) {
    redirect("/");
  }
}
