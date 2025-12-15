-- PROFILES Table
create table public.profiles
(
    id         uuid primary key references auth.users (id) on delete cascade,
    role       text not null check (role in ('student', 'teacher', 'admin')),
    created_at timestamp with time zone default now()
);

-- Optional: Index für Role-Abfragen
create index profiles_role_idx on public.profiles (role);
