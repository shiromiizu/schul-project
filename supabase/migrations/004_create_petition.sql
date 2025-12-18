-- PETITIONS Table
-- Speichert alle eingereichten Verbesserungsvorschläge / Petitionen

create table public.petitions
(
    id          uuid primary key         default gen_random_uuid(),

    -- Technischer Ersteller (anonym in der UI)
    creator_id  uuid not null references public.profiles (id) on delete cascade,

    title       text not null,
    description text not null,

    -- Status der Petition
    status      text not null
        check (status in ('pending', 'approved', 'rejected'))
                                         default 'pending',

    created_at  timestamp with time zone default now(),
    updated_at  timestamp with time zone default now()
);

-- Indexe für häufige Abfragen
create index petitions_status_idx on public.petitions (status);
create index petitions_creator_idx on public.petitions (creator_id);
