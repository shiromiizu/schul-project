import { getUser, getRole } from "@/utils/supabase/user"
import { redirect } from "next/navigation"

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  const role = await getRole()

  if (role !== "teacher" && role !== "admin") {
    redirect("/student")
  }

  return <>{children}</>
}
