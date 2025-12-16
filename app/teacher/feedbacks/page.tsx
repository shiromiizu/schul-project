import { createClient } from "@/utils/supabase/server"
import { requireRole } from "@/utils/auth"
import { FeedbackFilters } from "@/components/teacher/feedback-filters"
import { FeedbackList } from "@/components/feedback-list"

interface PageProps {
  searchParams: Promise<{
    category?: string
    sort?: string
    hideAnswered?: string
  }>
}

export default async function TeacherFeedbacksPage({ searchParams }: PageProps) {
  await requireRole("teacher")
  
  const params = await searchParams
  const category = params.category || "all"
  const sort = params.sort || "oldest"
  const hideAnswered = params.hideAnswered !== "false" // Default true

  const supabase = await createClient()

  let query = supabase
    .from("feedback")
    .select("*, feedback_replies(count)")

  if (category !== "all") {
    query = query.eq("category", category)
  }

  // Sortierung
  query = query.order("created_at", { ascending: sort === "oldest" })

  const { data, error } = await query

  if (error) {
    console.error("Error fetching feedbacks:", error)
    return <div>Fehler beim Laden der Feedbacks.</div>
  }

  // Filter answered (client-side filtering for now as Supabase doesn't support filtering by relation count easily in one query)
  // feedback_replies is returned as [{ count: n }]
  let feedbacks = data || []

  if (hideAnswered) {
    feedbacks = feedbacks.filter((f: any) => {
      const replyCount = f.feedback_replies?.[0]?.count || 0
      return replyCount === 0
    })
  }

  // Map to the format expected by FeedbackList (removing the extra property if needed, or just passing it)
  // FeedbackList expects: id, category, title, description, created_at, seen_by_teacher
  // The data from DB matches this.

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Feedback Übersicht</h1>
      
      <FeedbackFilters />
      
      <FeedbackList feedbacks={feedbacks} />
    </div>
  )
}
