-- Enable extensions
create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  role text default 'user' check (role in ('user','admin')),
  created_at timestamptz default now()
);

create table if not exists public.tools (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  short_description text not null,
  description text not null,
  category_slug text not null,
  category_name text not null,
  is_premium boolean default false,
  is_featured boolean default false,
  version text default '1.0.0',
  compatibility text,
  tags text[] default '{}',
  installation_guide text,
  usage_guide text,
  changelog text[] default '{}',
  thumbnail_url text,
  banner_url text,
  download_url text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.downloads (
  id uuid primary key default uuid_generate_v4(),
  tool_id uuid not null references public.tools(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  downloaded_at timestamptz default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.tools enable row level security;
alter table public.downloads enable row level security;

create policy "profiles are viewable by everyone" on public.profiles for select using (true);
create policy "users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "tools are viewable by everyone" on public.tools for select using (true);
create policy "admins manage tools" on public.tools for all
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "downloads insert by authenticated users" on public.downloads
for insert with check (auth.uid() is not null or user_id is null);
create policy "downloads read by admins" on public.downloads
for select using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Storage buckets (run in SQL editor)
insert into storage.buckets (id, name, public)
values ('thumbnails', 'thumbnails', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('tool-files', 'tool-files', true)
on conflict (id) do nothing;

create policy "public read thumbnails" on storage.objects
for select using (bucket_id = 'thumbnails');
create policy "admins upload thumbnails" on storage.objects
for insert with check (
  bucket_id = 'thumbnails' and
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

create policy "public read tool files" on storage.objects
for select using (bucket_id = 'tool-files');
create policy "admins upload tool files" on storage.objects
for insert with check (
  bucket_id = 'tool-files' and
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

