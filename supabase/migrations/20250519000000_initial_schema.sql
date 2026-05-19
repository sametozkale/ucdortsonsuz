-- Üç Dört Sonsuz — initial schema

create extension if not exists "pgcrypto";

-- Books
create table public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author_name text not null,
  slug text not null unique,
  description text,
  cover_image_url text,
  created_at timestamptz not null default now()
);

-- Sections
create type public.book_section_type as enum (
  'front_matter',
  'toc',
  'story',
  'poems',
  'essays'
);

create table public.book_sections (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books (id) on delete cascade,
  type public.book_section_type not null,
  title text not null,
  sort_order int not null,
  unique (book_id, sort_order)
);

-- Items
create type public.book_item_kind as enum ('poem', 'essay', 'page');

create table public.book_items (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books (id) on delete cascade,
  section_id uuid not null references public.book_sections (id) on delete cascade,
  kind public.book_item_kind not null,
  title text not null,
  slug text not null,
  excerpt text,
  body_md text,
  sort_order int not null,
  is_sample boolean not null default false,
  is_public_seo boolean not null default true,
  page_breaks jsonb,
  created_at timestamptz not null default now(),
  unique (book_id, slug)
);

create index book_items_book_sort_idx on public.book_items (book_id, sort_order);
create index book_items_sample_idx on public.book_items (book_id, is_sample) where is_sample = true;

-- Public view (no body for anon)
create or replace view public.book_items_public
with (security_invoker = true) as
select
  id,
  book_id,
  section_id,
  kind,
  title,
  slug,
  excerpt,
  sort_order,
  is_sample,
  is_public_seo
from public.book_items;

-- Purchases & entitlements (Faz 2)
create table public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  book_id uuid not null references public.books (id) on delete cascade,
  provider text not null check (provider in ('stripe', 'iyzico', 'manual')),
  external_id text,
  status text not null default 'pending',
  amount_cents int,
  currency text default 'TRY',
  created_at timestamptz not null default now()
);

create table public.entitlements (
  user_id uuid not null references auth.users (id) on delete cascade,
  book_id uuid not null references public.books (id) on delete cascade,
  granted_at timestamptz not null default now(),
  primary key (user_id, book_id)
);

-- Newsletter
create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  source text default 'website',
  consent boolean not null default true,
  created_at timestamptz not null default now()
);

-- Author content (optional CMS fields)
create table public.site_content (
  key text primary key,
  value_md text not null,
  updated_at timestamptz not null default now()
);

-- RLS
alter table public.books enable row level security;
alter table public.book_sections enable row level security;
alter table public.book_items enable row level security;
alter table public.purchases enable row level security;
alter table public.entitlements enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.site_content enable row level security;

-- Public read: books, sections
create policy "books_public_read" on public.books
  for select to anon, authenticated using (true);

create policy "sections_public_read" on public.book_sections
  for select to anon, authenticated using (true);

-- book_items: sample body OR entitled user
create policy "items_sample_read" on public.book_items
  for select to anon, authenticated
  using (is_sample = true);

create policy "items_entitled_read" on public.book_items
  for select to authenticated
  using (
    exists (
      select 1 from public.entitlements e
      where e.user_id = auth.uid() and e.book_id = book_items.book_id
    )
  );

-- Dev bypass via service role only; app uses mock when no Supabase

-- Newsletter insert (anon can subscribe)
create policy "newsletter_insert" on public.newsletter_subscribers
  for insert to anon, authenticated
  with check (consent = true);

create policy "newsletter_no_public_read" on public.newsletter_subscribers
  for select to authenticated
  using (false);

-- Entitlements: users read own
create policy "entitlements_own_read" on public.entitlements
  for select to authenticated
  using (user_id = auth.uid());

-- Purchases: own
create policy "purchases_own_read" on public.purchases
  for select to authenticated
  using (user_id = auth.uid());

-- site_content public read
create policy "site_content_read" on public.site_content
  for select to anon, authenticated using (true);

-- Seed book row (run after migration)
insert into public.books (id, title, author_name, slug, description)
values (
  '00000000-0000-4000-8000-000000000001',
  'Üç Dört Sonsuz',
  'Samet Özkale',
  'uc-dort-sonsuz',
  '45 şiir ve 11 denemeden oluşan şiir kitabı.'
) on conflict (slug) do nothing;
