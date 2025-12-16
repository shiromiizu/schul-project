import { getUser, getRole } from "@/utils/supabase/user"
import { redirect } from "next/navigation"

export async function GET() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  const role = await getRole()

  if (role === "teacher") {
    redirect("/teacher")
  } else if (role === "student") {
    redirect("/student")
  } else if (role === "admin") {
    redirect("/teacher")
  }

  redirect("/login")
}
