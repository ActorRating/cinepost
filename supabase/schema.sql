-- CinePost Database Schema
-- Run this in your Supabase SQL editor

-- Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  plan text not null default 'free' check (plan in ('free', 'pro', 'agency')),
  generations_today integer not null default 0,
  generations_total integer not null default 0,
  last_generation_date date,
  lemonsqueezy_customer_id text,
  lemonsqueezy_subscription_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Migration: if upgrading from Stripe, run:
-- alter table public.profiles rename column stripe_customer_id to lemonsqueezy_customer_id;
-- alter table public.profiles rename column stripe_subscription_id to lemonsqueezy_subscription_id;
-- Or add new columns:
-- alter table public.profiles add column if not exists lemonsqueezy_customer_id text;
-- alter table public.profiles add column if not exists lemonsqueezy_subscription_id text;

-- Generated posts
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  actor_name text not null,
  post_text text not null,
  headshot_url text,
  is_favorite boolean not null default false,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists posts_user_id_idx on public.posts(user_id);
create index if not exists posts_created_at_idx on public.posts(created_at desc);
create index if not exists posts_is_favorite_idx on public.posts(is_favorite) where is_favorite = true;

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Updated at trigger
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.posts enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Posts policies
create policy "Users can view own posts"
  on public.posts for select
  using (auth.uid() = user_id);

create policy "Users can insert own posts"
  on public.posts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own posts"
  on public.posts for update
  using (auth.uid() = user_id);

create policy "Users can delete own posts"
  on public.posts for delete
  using (auth.uid() = user_id);
