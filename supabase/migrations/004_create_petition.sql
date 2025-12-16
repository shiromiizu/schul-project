import (pet)

-- FEEDBACK Table
create table public.feedback
(
    id          uuid primary key         default gen_random_uuid(),
    student_id  uuid not null references public.profiles (id) on delete cascade,
    title       text not null,
    description text not null,
    status      text not null            default 'In Prüfung',
    votes       integer                  default 0,
    expires_at  timestamp with time zone default (now() + interval '3 months'),
    created_at  timestamp with time zone default now()
);

-- Indexes
create index petition_student_id_idx on public.petition (student_id);
create index petition_created_at_idx on public.petition (created_at desc);