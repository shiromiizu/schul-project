'use server'

import { createClient } from "@/utils/supabase/server"
import { Petition } from "@/lib/types"
import { revalidatePath } from "next/cache"

// --- Feedback Actions ---

export async function getRecentFeedbacks() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("feedback")
    .select(`
      *,
      feedback_replies(count)
    `)
    .order("created_at", { ascending: false })
    .limit(5)

  if (error) {
    console.error("Error fetching feedbacks:", error)
    return []
  }

  return data.map(f => ({
    ...f,
    isAnswered: f.feedback_replies?.[0]?.count > 0
  }))
}

// --- Petition Actions (Mock) ---

let mockPetitions: Petition[] = [
  {
    id: "1",
    title: "Wasserspender in der Aula",
    description: "Wir hätten gerne einen Wasserspender in der Aula, damit wir unsere Flaschen auffüllen können.",
    status: "pending",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    student_name: "Max Mustermann",
    votes: 0
  },
  {
    id: "2",
    title: "Längere Pausen am Vormittag",
    description: "Die 15 Minuten Pause reichen oft nicht aus, um zur Toilette zu gehen und etwas zu essen.",
    status: "pending",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    student_name: "Lisa Müller",
    votes: 0
  },
  {
    id: "3",
    title: "Mehr Fahrradständer",
    description: "Die Fahrradständer sind morgens immer voll.",
    status: "approved",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    student_name: "Tom Schmidt",
    votes: 15
  }
]

export async function getRecentPetitions(): Promise<Petition[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))
  return mockPetitions.filter(p => p.status === 'pending')
}

export async function approvePetition(id: string) {
  await new Promise(resolve => setTimeout(resolve, 500))
  const petition = mockPetitions.find(p => p.id === id)
  if (petition) {
    petition.status = 'approved'
  }
  revalidatePath('/teacher')
}

export async function rejectPetition(id: string, reason: string) {
  await new Promise(resolve => setTimeout(resolve, 500))
  const petition = mockPetitions.find(p => p.id === id)
  if (petition) {
    petition.status = 'rejected'
    console.log(`Petition ${id} rejected. Reason: ${reason}`)
    // Here we would send a notification to the student
  }
  revalidatePath('/teacher')
}
