-- PETITION_VOTES Table
-- Upvote / Downvote System (manipulationssicher)

create table public.petition_votes
(
    id          uuid primary key         default gen_random_uuid(),

    petition_id uuid     not null
        references public.petitions (id) on delete cascade,

    voter_id    uuid     not null
        references public.profiles (id) on delete cascade,

    -- 1 = Upvote, -1 = Downvote
    vote        smallint not null check (vote in (-1, 1)),

    created_at  timestamp with time zone default now(),

    -- Erzwingt: nur eine Stimme pro Schüler pro Petition
    unique (petition_id, voter_id)
);

-- Indexe
create index petition_votes_petition_idx
    on public.petition_votes (petition_id);

create index petition_votes_voter_idx
    on public.petition_votes (voter_id);

