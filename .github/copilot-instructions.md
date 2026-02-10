# B3Echo - AI Coding Agent Instructions

## Project Overview
B3Echo is a **Next.js 16 + Supabase** student feedback and petition platform for a German school (B3 School). Students submit anonymous feedback and improvement petitions; teachers review and respond. The app uses **role-based access control** with three roles: `student`, `teacher`, and `admin`.

## Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui
- **Backend**: Supabase (Auth, PostgreSQL)
- **Forms**: React Hook Form + Zod schemas
- **Email**: Nodemailer (SMTP)
- **Deployment**: Vercel (via Azure Pipelines)

## Architecture Patterns

### Server Actions & Form Handling
All mutations use **server actions** (`'use server'`) with a specific pattern:
- Actions return typed state objects: `{ errors?: {...}, message?: string, success?: boolean }`
- Forms use `useActionState` (React 19) for progressive enhancement
- Combine `react-hook-form` for client validation with server action for submission
- Example: [app/login/actions.ts](app/login/actions.ts) + [components/auth/login-form.tsx](components/auth/login-form.tsx)

```typescript
// Server action pattern
export async function actionName(prevState: FormState, formData: FormData): Promise<FormState> {
  const validated = schema.safeParse({ /* extract formData */ })
  if (!validated.success) return { errors: validated.error.flatten().fieldErrors }
  // ... perform action
  revalidatePath('/path')  // Always revalidate after mutations
  redirect('/success')     // Use redirect() for navigation
}
```

### Authentication & Authorization
- **User creation**: Supabase Auth creates `auth.users`, trigger creates `profiles` record
- **Role checking**: Use `getUser()` and `getRole()` from [utils/supabase/user.ts](utils/supabase/user.ts)
- **Protected routes**: Layout files check role and redirect (see [app/student/layout.tsx](app/student/layout.tsx), [app/teacher/layout.tsx](app/teacher/layout.tsx))
- **Email verification**: Required for registration; domain restriction: `schueler.6072-fuerth.de` or `6072-fuerth.de` (bypass via env `NEXT_PUBLIC_IGNORE_EMAIL_DOMAIN=true`)

### Supabase Client Pattern
- **Server components**: Always use `createClient()` from [utils/supabase/server.ts](utils/supabase/server.ts)
- **Middleware**: Auth refresh handled in [utils/supabase/middleware.ts](utils/supabase/middleware.ts)
- Server client is cookie-based with `'use server'` directive

### Database Schema
Key tables (see [supabase/migrations](supabase/migrations)):
- `profiles`: User roles (`student`, `teacher`, `admin`)
- `feedback`: Student submissions with `seen_by_teacher` flag
- `feedback_replies`: Teacher responses (many-to-one with feedback)
- `petitions`: Improvement suggestions with status (`pending`, `approved`, `rejected`)
- `petition_votes`, `petition_moderation`, `petition_notifications`, `petition_ranking`

### Validation & Types
- **Zod schemas**: Centralized in [lib/schemas.ts](lib/schemas.ts) - reuse for both client and server
- **TypeScript types**: Database types in [lib/types.ts](lib/types.ts) (e.g., `Feedback`, `Petition`, `CategoryValue`)
- **Categories**: Use `Category` const object (`TEACHER`, `BUILDING`, `OTHER`) with German labels in `CategoryRecord`

### Email Notifications
- Teacher receives email on new feedback via `notifyTeacherFeedback()` in [lib/send-mail.ts](lib/send-mail.ts)
- Uses HTML templates from [lib/email-templates/](lib/email-templates/) with `{{placeholder}}` syntax
- Configure SMTP via env vars: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SITE_MAIL_RECEIVER`

## Component Conventions
- **shadcn/ui components**: Located in [components/ui/](components/ui/) - follow shadcn patterns, don't modify core behavior
- **Path aliases**: Use `@/` for imports (configured in [tsconfig.json](tsconfig.json))
- **Styling**: Tailwind with CSS variables for theming; use `cn()` from [lib/utils.ts](lib/utils.ts) for conditional classes
- **Dark mode**: Handled by `next-themes` in [components/theme-provider.tsx](components/theme-provider.tsx)

## Development Workflow
```bash
npm run dev           # Start dev server on localhost:3000
npm run build         # Production build
npm run lint          # ESLint check
npm run format        # Format with Prettier
```

### Local Supabase Setup
- Migrations in [supabase/migrations/](supabase/migrations/) numbered sequentially
- Apply migrations: `supabase db push` (requires Supabase CLI)
- Environment variables needed: `SUPABASE_URL`, `SUPABASE_ANON_KEY`

## Language & Localization
- **German-first**: All UI text, error messages, and validation in German
- Schema error messages use German strings
- Date formatting uses German locale

## Key Files Reference
- **Auth utilities**: [utils/auth.ts](utils/auth.ts), [utils/supabase/user.ts](utils/supabase/user.ts)
- **Root layout**: [app/layout.tsx](app/layout.tsx) - includes Header, ThemeProvider, Toaster
- **Server actions**: Each route has `actions.ts` for mutations (e.g., [app/student/submit-feedback/action.ts](app/student/submit-feedback/action.ts))
- **Schemas**: [lib/schemas.ts](lib/schemas.ts) - all form validation
- **Types**: [lib/types.ts](lib/types.ts) - shared TypeScript types

## Common Patterns to Follow
1. **Always use server actions for mutations** - no API routes
2. **Validate twice**: Client-side (react-hook-form) + server-side (Zod)
3. **Revalidate paths** after mutations with `revalidatePath()`
4. **Use redirect()** for navigation in server actions, not `router.push()`
5. **Check user role** in layouts, not individual pages
6. **Email templates**: Use HTML files with `{{placeholders}}` processed by `fill()` function
7. **Pending states**: Use `isPending` from `useActionState` for submit buttons
