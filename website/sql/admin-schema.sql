-- Private Bizonix control workspace. Apply with `pnpm admin:migrate`.
-- This schema is deliberately independent of any Vercel product or provider.

create table if not exists admin_users (
  id text primary key,
  username text not null unique check (username = lower(username)),
  password_hash text not null,
  created_at timestamptz not null default now(),
  last_login_at timestamptz
);

create table if not exists admin_sessions (
  id text primary key,
  user_id text not null references admin_users(id) on delete cascade,
  token_hash char(64) not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists admin_sessions_expires_at_idx on admin_sessions (expires_at);

create table if not exists admin_login_attempts (
  scope_hash char(64) primary key,
  failed_count integer not null default 0 check (failed_count >= 0),
  first_attempt_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  locked_until timestamptz
);

-- The future hero editor stores only approved variant configuration. It does
-- not change the public homepage until a later publishing workflow is added.
create table if not exists home_hero_variants (
  id text primary key,
  slug text not null unique,
  label text not null,
  status text not null default 'draft' check (status in ('draft', 'active', 'archived')),
  definition jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists home_hero_variants_status_idx on home_hero_variants (status);
