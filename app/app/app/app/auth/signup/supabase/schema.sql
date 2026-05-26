-- Roles create table if not exists app_roles ( role text primary key ); insert into app_roles(role) values ('user') on conflict do nothing; insert into app_roles(role) values ('admin') on conflict do nothing;

-- Users profile (1-1 with auth.users) create table if not exists profiles ( user_id uuid primary key references auth.users(id) on delete cascade, display_name text not null, bio text, location text, languages text[] default '{}', categories text[] default '{}', avatar_url text, is_open_to_collab boolean default true, created_at timestamp with time zone default now(), updated_at timestamp with time zone default now() );

-- Social accounts create table if not exists social_accounts ( id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade, platform text check (platform in ('instagram','tiktok','youtube','x','twitch')), handle text not null, profile_url text,follower_count integer, verified boolean default false, verified_at timestamp with time zone, last_updated timestamp with time zone default now() ); create index on social_accounts(user_id); create index on social_accounts(platform, handle);

-- Collaboration requirements create table if not exists collab_requirements ( user_id uuid primary key references auth.users(id) on delete cascade, min_total_followers integer default 0, min_platform_followers jsonb default '{}'::jsonb, allowed_platforms text[] default '{}', allowed_categories text[] default '{}', created_at timestamp with time zone default now(), updated_at timestamp with time zone default now() );

-- Collab requests create table if not exists collab_requests ( id uuid primary key default gen_random_uuid(), from_user_id uuid references auth.users(id) on delete cascade, to_user_id uuid references auth.users(id) on delete cascade, message text, attachments jsonb default '[]'::jsonb, status text check (status in ('pending','accepted','declined','withdrawn')) default 'pending', created_at timestamp with time zone default now(), updated_at timestamp with time zone default now() ); create index on collab_requests(to_user_id, status, created_at desc); create index on collab_requests(from_user_id, created_at desc);

-- Feedback create table if not exists feedback ( id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete set null, category text, message text not null, created_at timestamp with time zone default now() );
-- App settings / feature flags create table if not exists app_settings ( key text primary key, value jsonb not null, updated_at timestamp with time zone default now() ); insert into app_settings(key, value) values ('billing_enabled', 'false'::jsonb) on conflict (key) do nothing; insert into app_settings(key, value) values ('request_limits', '{"free_monthly_limit":30,"daily_cap":5,"per_target_days":7}'::jsonb) on conflict (key) do nothing;

-- Simple analytics events (optional) create table if not exists app_events ( id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete set null, name text not null, -- 'signup','profile_completed','request_sent','request_accepted' metadata jsonb default '{}'::jsonb, created_at timestamp with time zone default now() ); create index on app_events(name, created_at desc);

-- Enable Row Level Security alter table profiles enable row level security; alter table social_accounts enable row level security; alter table collab_requirements enable row level security; alter table collab_requests enable row level security; alter table feedback enable row level security; alter table app_events enable row level security;

-- RLS policies create policy "Public read profiles" on profiles for select using (true); create policy "Users manage own profile" on profiles for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Public read social" on social_accounts for select using (true); create policy "Users manage own social" on social_accounts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users read own requirements" on collab_requirements for select using (auth.uid() = user_id); create policy "Users upsert own requirements" on collab_requirements for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can see requests to them or from them" on collab_requests for select using (auth.uid() = to_user_id or auth.uid() = from_user_id); create policy "Users can create requests" on collab_requests for insert with check (auth.uid() = from_user_id); create policy "Users can update own requests" on collab_requests for update using (auth.uid() = from_user_id or auth.uid() = to_user_id);

create policy "Users create feedback" on feedback for insert with check (auth.uid() = user_id or user_id is null); create policy "Admins read everything" on feedback for select using (true);

create policy "Users create events" on app_events for insert with check (auth.uid() = user_id or user_id is null);
