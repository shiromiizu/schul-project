import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export default async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico|css|js|map)$).*)',
  ],
};
