-- PETITION_RANKING View
-- Liefert Ranking nach Relevanz (Score)

create or replace view public.petition_ranking as
select
    p.id,
    p.title,
    p.description,
    p.created_at,

    coalesce(sum(v.vote), 0) as score,
    count(v.id)             as total_votes

from public.petitions p
         left join public.petition_votes v
                   on p.id = v.petition_id

where p.status = 'approved'
group by p.id;
