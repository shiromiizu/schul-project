-- PETITION_NOTIFICATIONS Table
-- Benachrichtigungen bei Annahme / Ablehnung

create table public.petition_notifications
(
    id           uuid primary key         default gen_random_uuid(),

    recipient_id uuid not null
        references public.profiles (id) on delete cascade,

    petition_id  uuid not null
        references public.petitions (id) on delete cascade,

    type         text not null
        check (type in ('approved', 'rejected')),

    message      text not null,

    read         boolean                  default false,
    created_at   timestamp with time zone default now()
);

-- Indexe
create index petition_notifications_recipient_idx
    on public.petition_notifications (recipient_id);

create index petition_notifications_read_idx
    on public.petition_notifications (read);

