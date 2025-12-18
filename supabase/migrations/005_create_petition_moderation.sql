-- PETITION_MODERATION Table
-- Dokumentiert Moderationsentscheidungen (Nachvollziehbarkeit)

create table public.petition_moderation
(
    id           uuid primary key         default gen_random_uuid(),

    petition_id  uuid not null
        references public.petitions (id) on delete cascade,

    moderator_id uuid not null
        references public.profiles (id),

    -- Begründung ist verpflichtend
    reason       text not null,

    created_at   timestamp with time zone default now()
);

-- Indexe
create index petition_moderation_petition_idx
    on public.petition_moderation (petition_id);

create index petition_moderation_moderator_idx
    on public.petition_moderation (moderator_id);
