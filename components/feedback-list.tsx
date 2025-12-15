import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CategoryRecord } from "@/lib/types"

type Feedback = {
  id: string
  category: string
  title: string
  description: string
  created_at: string
  seen_by_teacher: boolean
}

interface FeedbackListProps {
  feedbacks: Feedback[]
}

export function FeedbackList({ feedbacks }: FeedbackListProps) {
  const getCategoryLabel = (categoryValue: string) => {
    const category = Object.values(CategoryRecord).find(c => c.value === categoryValue)
    return category ? category.label : categoryValue
  }

  if (feedbacks.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Keine Feedbacks gefunden.
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {feedbacks.map((feedback) => (
        <Card key={feedback.id}>
          <CardHeader>
            <div className="flex justify-between items-start gap-2">
              <CardTitle className="text-lg font-semibold leading-none tracking-tight">
                {feedback.title}
              </CardTitle>
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                {getCategoryLabel(feedback.category)}
              </span>
            </div>
            <CardDescription>
              {new Date(feedback.created_at).toLocaleDateString('de-DE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {feedback.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
