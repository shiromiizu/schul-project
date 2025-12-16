import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { CategoryRecord } from "@/lib/types"

interface FeedbackInfoProps {
  feedback: any // Replace with proper type
  isTeacher: boolean
  isAnswered: boolean
}

export function FeedbackInfo({ feedback, isTeacher, isAnswered }: FeedbackInfoProps) {
  const categoryLabel = Object.values(CategoryRecord).find(c => c.value === feedback.category)?.label || feedback.category

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{categoryLabel}</Badge>
              {feedback.seen_by_teacher && <Badge variant="secondary">Gelesen</Badge>}
              {isAnswered && <Badge className="bg-green-500 hover:bg-green-600">Beantwortet</Badge>}
            </div>
            <CardTitle className="text-2xl">{feedback.title}</CardTitle>
            <CardDescription>
              Erstellt am {format(new Date(feedback.created_at), "PPP 'um' p", { locale: de })}
              {isTeacher && feedback.profiles && (
                <span className="block mt-1">
                  von {feedback.profiles.full_name} ({feedback.profiles.email})
                </span>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose dark:prose-invert max-w-none">
          <p className="whitespace-pre-wrap">{feedback.description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
