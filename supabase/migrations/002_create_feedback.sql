-- FEEDBACK Table
create table public.feedback
(
    id              uuid primary key         default gen_random_uuid(),
    student_id      uuid not null references public.profiles (id) on delete cascade,
    category        text not null,
    title           text not null,
    description     text not null,
    seen_by_teacher boolean                  default false,
    created_at      timestamp with time zone default now()
);

-- Indexes
create index feedback_student_id_idx on public.feedback (student_id);
create index feedback_created_at_idx on public.feedback (created_at desc);
