-- FEEDBACK_REPLIES Table
create table public.feedback_replies
(
    id          uuid primary key         default gen_random_uuid(),
    feedback_id uuid not null references public.feedback (id) on delete cascade,
    teacher_id  uuid not null references public.profiles (id),
    message     text not null,
    created_at  timestamp with time zone default now()
);

-- Indexes
create index feedback_replies_feedback_id_idx on public.feedback_replies (feedback_id);
create index feedback_replies_teacher_id_idx on public.feedback_replies (teacher_id);
