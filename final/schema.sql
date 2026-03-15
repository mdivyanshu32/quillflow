-- ============================================================
-- CONTENT WRITING SAAS — SUPABASE SCHEMA
-- Run this entire file in the Supabase SQL Editor
-- ============================================================


-- ============================================================
-- 0. EXTENSIONS
-- ============================================================
create extension if not exists "uuid-ossp";


-- ============================================================
-- 1. CUSTOM TYPES
-- ============================================================

create type order_status as enum (
  'pending',        -- submitted, not yet reviewed
  'in_review',      -- admin reviewing requirements
  'in_progress',    -- writer working on it
  'revision',       -- revision requested by client
  'completed',      -- delivered and accepted
  'cancelled'       -- cancelled by client or admin
);

create type content_type as enum (
  'blog_post',
  'website_copy',
  'product_description',
  'social_media',
  'email_sequence',
  'whitepaper',
  'case_study',
  'other'
);

create type content_tone as enum (
  'professional',
  'conversational',
  'persuasive',
  'informative',
  'humorous',
  'inspirational'
);


-- ============================================================
-- 2. PROFILES TABLE
-- Extends auth.users — one row per registered user
-- ============================================================

create table public.profiles (
  id                   uuid primary key references auth.users(id) on delete cascade,
  full_name            text,
  avatar_url           text,
  company              text,
  phone                text,
  timezone             text default 'UTC',
  email_notifications  boolean not null default true,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

comment on table public.profiles is
  'One row per auth user. Auto-created via trigger on auth.users insert.';


-- ============================================================
-- 3. ORDERS TABLE
-- Core business entity — one row per writing order
-- ============================================================

create table public.orders (
  id                   uuid primary key default uuid_generate_v4(),
  client_id            uuid not null references public.profiles(id) on delete cascade,
  title                text not null,
  description          text,
  word_count           int not null check (word_count > 0 and word_count <= 100000),
  content_type         content_type not null default 'blog_post',
  tone                 content_tone not null default 'professional',
  target_audience      text,
  special_instructions text,
  status               order_status not null default 'pending',
  total_price          numeric(10, 2) not null check (total_price >= 0),
  deadline             date,
  delivered_file_url   text,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

comment on table public.orders is
  'Writing orders placed by clients. RLS: clients see only their own rows.';

comment on column public.orders.delivered_file_url is
  'Supabase Storage URL of the delivered document once completed.';


-- ============================================================
-- 4. ORDER_NOTES TABLE
-- Threaded comments on an order (client ↔ admin)
-- ============================================================

create table public.order_notes (
  id           uuid primary key default uuid_generate_v4(),
  order_id     uuid not null references public.orders(id) on delete cascade,
  author_id    uuid not null references public.profiles(id) on delete cascade,
  content      text not null,
  is_internal  boolean not null default false,  -- true = admin-only note, hidden from client
  created_at   timestamptz not null default now()
);

comment on table public.order_notes is
  'Threaded notes on orders. is_internal=true rows are hidden from clients via RLS.';


-- ============================================================
-- 5. ORDER_STATUS_HISTORY TABLE
-- Full audit trail of every status change
-- ============================================================

create table public.order_status_history (
  id           uuid primary key default uuid_generate_v4(),
  order_id     uuid not null references public.orders(id) on delete cascade,
  changed_by   uuid not null references public.profiles(id) on delete cascade,
  from_status  order_status,          -- null for the very first transition
  to_status    order_status not null,
  note         text,                  -- optional reason / message
  changed_at   timestamptz not null default now()
);

comment on table public.order_status_history is
  'Immutable audit log. One row per status change. Never updated or deleted.';


-- ============================================================
-- 6. INDEXES
-- ============================================================

-- Orders — most queries filter by client + status
create index idx_orders_client_id      on public.orders(client_id);
create index idx_orders_status         on public.orders(status);
create index idx_orders_created_at     on public.orders(created_at desc);
create index idx_orders_client_status  on public.orders(client_id, status);

-- Notes — always loaded per order
create index idx_order_notes_order_id  on public.order_notes(order_id);
create index idx_order_notes_author_id on public.order_notes(author_id);

-- Status history — loaded per order, ordered by time
create index idx_status_history_order  on public.order_status_history(order_id, changed_at desc);


-- ============================================================
-- 7. TRIGGERS
-- ============================================================

-- 7a. Auto-update updated_at on profiles and orders
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger trg_orders_updated_at
  before update on public.orders
  for each row execute function public.handle_updated_at();


-- 7b. Auto-create profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- 7c. Auto-insert status history row whenever order status changes
create or replace function public.handle_order_status_change()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (old.status is distinct from new.status) then
    insert into public.order_status_history
      (order_id, changed_by, from_status, to_status)
    values
      (new.id, new.client_id, old.status, new.status);
  end if;
  return new;
end;
$$;

create trigger trg_order_status_history
  after update on public.orders
  for each row execute function public.handle_order_status_change();


-- ============================================================
-- 8. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
alter table public.profiles             enable row level security;
alter table public.orders               enable row level security;
alter table public.order_notes          enable row level security;
alter table public.order_status_history enable row level security;


-- ────────────────────────────────────────────────────────────
-- 8a. PROFILES policies
-- ────────────────────────────────────────────────────────────

-- Users can read their own profile only
create policy "profiles: users can read own"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can update their own profile only
create policy "profiles: users can update own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Insert is handled by the trigger (service_role) — block direct client inserts
create policy "profiles: no direct insert"
  on public.profiles for insert
  with check (false);


-- ────────────────────────────────────────────────────────────
-- 8b. ORDERS policies
-- ────────────────────────────────────────────────────────────

-- Clients can only see their own orders
create policy "orders: clients can read own"
  on public.orders for select
  using (auth.uid() = client_id);

-- Clients can insert orders for themselves only
create policy "orders: clients can insert own"
  on public.orders for insert
  with check (auth.uid() = client_id);

-- Clients can update only title/description/special_instructions
-- Status changes are admin-only (enforced at app layer + service_role)
create policy "orders: clients can update own non-status fields"
  on public.orders for update
  using (auth.uid() = client_id)
  with check (auth.uid() = client_id);

-- Clients can delete only their pending orders (soft restriction — app layer adds more)
create policy "orders: clients can delete own pending"
  on public.orders for delete
  using (auth.uid() = client_id and status = 'pending');


-- ────────────────────────────────────────────────────────────
-- 8c. ORDER_NOTES policies
-- ────────────────────────────────────────────────────────────

-- Clients can read notes on their own orders, but NOT internal notes
create policy "order_notes: clients can read non-internal on own orders"
  on public.order_notes for select
  using (
    is_internal = false
    and exists (
      select 1 from public.orders
      where orders.id = order_notes.order_id
        and orders.client_id = auth.uid()
    )
  );

-- Clients can insert notes on their own orders (always non-internal)
create policy "order_notes: clients can insert on own orders"
  on public.order_notes for insert
  with check (
    auth.uid() = author_id
    and is_internal = false
    and exists (
      select 1 from public.orders
      where orders.id = order_notes.order_id
        and orders.client_id = auth.uid()
    )
  );

-- Authors can delete their own notes
create policy "order_notes: authors can delete own"
  on public.order_notes for delete
  using (auth.uid() = author_id);


-- ────────────────────────────────────────────────────────────
-- 8d. ORDER_STATUS_HISTORY policies
-- ────────────────────────────────────────────────────────────

-- Clients can read history for their own orders
create policy "status_history: clients can read own"
  on public.order_status_history for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_status_history.order_id
        and orders.client_id = auth.uid()
    )
  );

-- History is append-only from triggers/service_role — block all direct mutations
create policy "status_history: no direct insert"
  on public.order_status_history for insert
  with check (false);

create policy "status_history: no update"
  on public.order_status_history for update
  using (false);

create policy "status_history: no delete"
  on public.order_status_history for delete
  using (false);


-- ============================================================
-- 9. STORAGE BUCKETS
-- ============================================================

-- Avatars bucket — public read, authenticated upload
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict do nothing;

create policy "avatars: public read"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "avatars: authenticated upload"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatars: owner update"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Deliverables bucket — private, only order owner can read
insert into storage.buckets (id, name, public)
values ('deliverables', 'deliverables', false)
on conflict do nothing;

create policy "deliverables: owner read"
  on storage.objects for select
  using (
    bucket_id = 'deliverables'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );


-- ============================================================
-- 10. HELPER FUNCTIONS (callable from app)
-- ============================================================

-- Returns KPI stats for the current authenticated user
create or replace function public.get_client_stats()
returns json language plpgsql security definer set search_path = public as $$
declare
  result json;
begin
  select json_build_object(
    'total_orders',     count(*),
    'active_orders',    count(*) filter (where status in ('in_review','in_progress','revision')),
    'completed_orders', count(*) filter (where status = 'completed'),
    'total_spent',      coalesce(sum(total_price) filter (where status = 'completed'), 0),
    'pending_orders',   count(*) filter (where status = 'pending')
  )
  into result
  from public.orders
  where client_id = auth.uid();

  return result;
end;
$$;


-- Returns orders per month for the last 6 months (for chart)
create or replace function public.get_orders_by_month()
returns table (month text, order_count bigint) language sql security definer set search_path = public as $$
  select
    to_char(date_trunc('month', created_at), 'Mon YYYY') as month,
    count(*) as order_count
  from public.orders
  where
    client_id = auth.uid()
    and created_at >= now() - interval '6 months'
  group by date_trunc('month', created_at)
  order by date_trunc('month', created_at);
$$;


-- ============================================================
-- 11. SEED DATA (development only)
-- Inserts two test users + sample orders
-- ============================================================

do $$
declare
  alice_id uuid := 'a0000000-0000-0000-0000-000000000001';
  bob_id   uuid := 'b0000000-0000-0000-0000-000000000002';
  order1   uuid := uuid_generate_v4();
  order2   uuid := uuid_generate_v4();
  order3   uuid := uuid_generate_v4();
  order4   uuid := uuid_generate_v4();
begin

  -- Profiles (in real use these are created by the trigger)
  insert into public.profiles (id, full_name, company, email_notifications)
  values
    (alice_id, 'Alice Johnson', 'Acme Marketing Co.', true),
    (bob_id,   'Bob Williams',  'Techstart Ltd.',     false)
  on conflict (id) do nothing;

  -- Orders for Alice
  insert into public.orders
    (id, client_id, title, description, word_count, content_type,
     tone, target_audience, status, total_price, deadline)
  values
    (order1, alice_id,
     'The Complete Guide to Content Marketing in 2025',
     'A comprehensive long-form guide covering strategy, tools, and case studies.',
     3000, 'blog_post', 'professional', 'Marketing managers at SMBs',
     'completed', 90.00, current_date - interval '10 days'),

    (order2, alice_id,
     'Homepage & About Us Website Copy',
     'Rewrite our homepage hero, value proposition, and about section.',
     800, 'website_copy', 'conversational', 'SaaS buyers aged 25-45',
     'in_progress', 48.00, current_date + interval '5 days'),

    (order3, alice_id,
     '5-Part Email Onboarding Sequence',
     'Onboarding emails for new trial users. Goal: convert to paid within 14 days.',
     1500, 'email_sequence', 'persuasive', 'Free trial users of a SaaS product',
     'pending', 60.00, current_date + interval '14 days')
  on conflict (id) do nothing;

  -- Order for Bob
  insert into public.orders
    (id, client_id, title, description, word_count, content_type,
     tone, target_audience, status, total_price, deadline)
  values
    (order4, bob_id,
     'AI in Healthcare: 2025 Industry Whitepaper',
     'A research-backed whitepaper covering AI adoption trends in UK hospitals.',
     5000, 'whitepaper', 'informative', 'NHS procurement directors',
     'in_review', 200.00, current_date + interval '21 days')
  on conflict (id) do nothing;

  -- Notes on Alice's order1
  insert into public.order_notes (order_id, author_id, content, is_internal)
  values
    (order1, alice_id, 'Please include at least 3 real-world case studies.', false),
    (order1, alice_id, 'Can we also add a TL;DR summary at the top?', false);

  -- Notes on Alice's order2
  insert into public.order_notes (order_id, author_id, content, is_internal)
  values
    (order2, alice_id, 'Our brand voice is friendly and direct — avoid jargon.', false);

  -- Initial status history rows for orders
  insert into public.order_status_history
    (order_id, changed_by, from_status, to_status, note)
  values
    (order1, alice_id, null,          'pending',     'Order placed'),
    (order1, alice_id, 'pending',     'in_review',   'Requirements confirmed'),
    (order1, alice_id, 'in_review',   'in_progress', 'Writing started'),
    (order1, alice_id, 'in_progress', 'completed',   'Delivered — client approved'),
    (order2, alice_id, null,          'pending',     'Order placed'),
    (order2, alice_id, 'pending',     'in_review',   'Brief reviewed'),
    (order2, alice_id, 'in_review',   'in_progress', 'Writer assigned'),
    (order3, alice_id, null,          'pending',     'Order placed'),
    (order4, bob_id,   null,          'pending',     'Order placed'),
    (order4, bob_id,   'pending',     'in_review',   'Reviewing scope');

end $$;
