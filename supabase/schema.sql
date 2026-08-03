-- Run this once in Supabase: SQL Editor -> New query -> Run.
create table if not exists public.site_likes (
  page_key text not null check (page_key ~ '^[a-z0-9-]{1,40}$'),
  visitor_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (page_key, visitor_id)
);

alter table public.site_likes enable row level security;

create or replace function public.get_site_like_state(p_page_key text, p_visitor_id uuid)
returns table(like_count bigint, liked boolean)
language sql stable security definer set search_path = public
as $$
  select
    (select count(*) from public.site_likes where page_key = p_page_key),
    exists(select 1 from public.site_likes where page_key = p_page_key and visitor_id = p_visitor_id);
$$;

create or replace function public.set_site_like_state(p_page_key text, p_visitor_id uuid, p_liked boolean)
returns table(like_count bigint, liked boolean)
language plpgsql security definer set search_path = public
as $$
begin
  if p_page_key !~ '^[a-z0-9-]{1,40}$' then
    raise exception using errcode = '22023', message = 'Invalid page key';
  end if;

  if p_liked then
    insert into public.site_likes(page_key, visitor_id) values (p_page_key, p_visitor_id)
    on conflict do nothing;
  else
    delete from public.site_likes where page_key = p_page_key and visitor_id = p_visitor_id;
  end if;

  return query select
    (select count(*) from public.site_likes where page_key = p_page_key),
    exists(select 1 from public.site_likes where page_key = p_page_key and visitor_id = p_visitor_id);
end;
$$;

revoke all on function public.get_site_like_state(text, uuid) from public;
revoke all on function public.set_site_like_state(text, uuid, boolean) from public;
grant execute on function public.get_site_like_state(text, uuid) to anon;
grant execute on function public.set_site_like_state(text, uuid, boolean) to anon;

-- No table policy is intentional. Only the narrow RPC functions above are
-- public, and direct table access remains blocked by RLS.
