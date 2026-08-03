-- Run this once in Supabase: SQL Editor -> New query -> Run.
create table if not exists public.site_likes (
  page_key text not null check (page_key ~ '^[a-z0-9-]{1,40}$'),
  visitor_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (page_key, visitor_id)
);

alter table public.site_likes enable row level security;

-- No public policy is intentional: only the server-side Vercel function uses
-- the Supabase secret key. Never expose that key in browser code.
