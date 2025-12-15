import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { feedbackSchema } from '@/lib/validations/feedback';
import { z } from 'zod';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validierung mit Zod
    const validatedData = feedbackSchema.parse(body);

    const supabase = await createClient();

    // Aktuellen Benutzer abrufen
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 });
    }

    // Feedback in die Datenbank einfügen
    const { data, error } = await supabase
      .from('feedback')
      .insert([
        {
          student_id: user.id,
          category: validatedData.category,
          title: validatedData.title,
          description: validatedData.description,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Fehler beim Einfügen des Feedbacks:', error);
      return NextResponse.json({ error: 'Fehler beim Speichern des Feedbacks' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    // Zod Validierungsfehler
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validierungsfehler', issues: error.issues },
        { status: 400 }
      );
    }

    console.error('Unerwarteter Fehler:', error);
    return NextResponse.json({ error: 'Ein unerwarteter Fehler ist aufgetreten' }, { status: 500 });
  }
}
