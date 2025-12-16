import { getUser, getRole } from "@/utils/supabase/user"
import { redirect } from "next/navigation"

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  const role = await getRole()

  if (role !== "student" && role !== "admin") {
    redirect("/teacher")
  }

  return <>{children}</>
}
