create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type user_role as enum (
      'admin',
      'operator',
      'sponsor',
      'reviewer',
      'beneficiary',
      'public_viewer'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'organization_type') then
    create type organization_type as enum (
      'foundation',
      'company',
      'dao',
      'ngo',
      'university',
      'accelerator',
      'public_sector',
      'other'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'grant_status') then
    create type grant_status as enum (
      'draft',
      'funding',
      'active',
      'paused',
      'completed',
      'cancelled'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'grant_visibility') then
    create type grant_visibility as enum (
      'private',
      'public'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'milestone_status') then
    create type milestone_status as enum (
      'planned',
      'in_progress',
      'submitted',
      'approved',
      'paused',
      'completed'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'evidence_status') then
    create type evidence_status as enum (
      'draft',
      'submitted',
      'under_review',
      'accepted',
      'rejected'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'evaluation_decision') then
    create type evaluation_decision as enum (
      'approve',
      'adjust',
      'pause',
      'reject'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'release_status') then
    create type release_status as enum (
      'queued',
      'submitted',
      'confirmed',
      'failed',
      'reverted'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'pause_state') then
    create type pause_state as enum (
      'active',
      'paused',
      'resolved'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'audit_event_type') then
    create type audit_event_type as enum (
      'grant_created',
      'grant_funded',
      'beneficiary_assigned',
      'milestone_added',
      'evidence_submitted',
      'evaluation_recorded',
      'release_submitted',
      'grant_paused',
      'grant_resumed',
      'grant_reclaimed'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'asset_kind') then
    create type asset_kind as enum (
      'xlm',
      'stablecoin',
      'custom_token'
    );
  end if;
end
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  login_name text not null unique,
  display_name text not null,
  email text unique,
  role user_role not null default 'public_viewer',
  status text not null default 'active' check (status in ('active', 'disabled')),
  auth_subject text unique,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger users_set_updated_at
before update on public.users
for each row
execute function public.set_updated_at();

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null unique,
  organization_type organization_type not null default 'other',
  website_url text,
  description text,
  created_by_user_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger organizations_set_updated_at
before update on public.organizations
for each row
execute function public.set_updated_at();

create table if not exists public.wallet_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  chain text not null default 'stellar',
  stellar_public_key text not null unique,
  wallet_provider text not null,
  is_primary boolean not null default false,
  is_verified boolean not null default false,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists wallet_accounts_user_id_idx on public.wallet_accounts(user_id);

create trigger wallet_accounts_set_updated_at
before update on public.wallet_accounts
for each row
execute function public.set_updated_at();

create table if not exists public.grants (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  sponsor_org_id uuid references public.organizations(id) on delete set null,
  reviewer_user_id uuid references public.users(id) on delete set null,
  beneficiary_user_id uuid references public.users(id) on delete set null,
  asset_kind asset_kind not null default 'xlm',
  asset_code text not null default 'XLM',
  asset_issuer text,
  total_amount numeric(38,7) not null check (total_amount >= 0),
  cap_per_window numeric(38,7) not null check (cap_per_window >= 0),
  released_amount numeric(38,7) not null default 0 check (released_amount >= 0),
  reserved_amount numeric(38,7) not null default 0 check (reserved_amount >= 0),
  window_days integer not null default 14 check (window_days > 0),
  current_window_started_at timestamptz,
  current_window_ends_at timestamptz,
  status grant_status not null default 'draft',
  visibility grant_visibility not null default 'public',
  contract_address text,
  contract_grant_id text,
  metadata_hash text,
  created_by_user_id uuid references public.users(id) on delete set null,
  approved_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint grants_released_within_total check (released_amount <= total_amount),
  constraint grants_reserved_within_total check (reserved_amount <= total_amount)
);

create unique index if not exists grants_contract_address_uq on public.grants(contract_address) where contract_address is not null;
create unique index if not exists grants_contract_grant_id_uq on public.grants(contract_grant_id) where contract_grant_id is not null;
create index if not exists grants_status_idx on public.grants(status);
create index if not exists grants_visibility_idx on public.grants(visibility);
create index if not exists grants_sponsor_org_id_idx on public.grants(sponsor_org_id);
create index if not exists grants_reviewer_user_id_idx on public.grants(reviewer_user_id);
create index if not exists grants_beneficiary_user_id_idx on public.grants(beneficiary_user_id);

create trigger grants_set_updated_at
before update on public.grants
for each row
execute function public.set_updated_at();

create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  grant_id uuid not null references public.grants(id) on delete cascade,
  order_index integer not null check (order_index >= 0),
  name text not null,
  description text,
  target_date date,
  budget_hint numeric(38,7) check (budget_hint is null or budget_hint >= 0),
  status milestone_status not null default 'planned',
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (grant_id, order_index)
);

create index if not exists milestones_grant_id_idx on public.milestones(grant_id);

create trigger milestones_set_updated_at
before update on public.milestones
for each row
execute function public.set_updated_at();

create table if not exists public.evidence_packs (
  id uuid primary key default gen_random_uuid(),
  grant_id uuid not null references public.grants(id) on delete cascade,
  submitted_by_user_id uuid references public.users(id) on delete set null,
  window_label text not null,
  github_repo_url text,
  github_branch text,
  github_commit_hash text,
  docs_url text,
  demo_url text,
  test_run_url text,
  notes text,
  evidence_hash text,
  status evidence_status not null default 'draft',
  submitted_at timestamptz,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists evidence_packs_grant_id_idx on public.evidence_packs(grant_id);
create index if not exists evidence_packs_status_idx on public.evidence_packs(status);
create unique index if not exists evidence_packs_evidence_hash_uq on public.evidence_packs(evidence_hash) where evidence_hash is not null;

create trigger evidence_packs_set_updated_at
before update on public.evidence_packs
for each row
execute function public.set_updated_at();

create table if not exists public.evidence_files (
  id uuid primary key default gen_random_uuid(),
  evidence_pack_id uuid not null references public.evidence_packs(id) on delete cascade,
  bucket_name text not null,
  storage_path text not null unique,
  file_name text not null,
  file_role text not null default 'attachment',
  mime_type text,
  byte_size bigint check (byte_size is null or byte_size >= 0),
  checksum text,
  created_at timestamptz not null default now()
);

create index if not exists evidence_files_pack_id_idx on public.evidence_files(evidence_pack_id);
create index if not exists evidence_files_bucket_name_idx on public.evidence_files(bucket_name);

create table if not exists public.evaluations (
  id uuid primary key default gen_random_uuid(),
  grant_id uuid not null references public.grants(id) on delete cascade,
  evidence_pack_id uuid references public.evidence_packs(id) on delete set null,
  reviewed_by_user_id uuid references public.users(id) on delete set null,
  score numeric(5,2) not null default 0 check (score >= 0 and score <= 100),
  progress_score numeric(5,2) not null default 0 check (progress_score >= 0 and progress_score <= 100),
  delivery_score numeric(5,2) not null default 0 check (delivery_score >= 0 and delivery_score <= 100),
  risk_score numeric(5,2) not null default 0 check (risk_score >= 0 and risk_score <= 100),
  suggested_amount numeric(38,7) not null default 0 check (suggested_amount >= 0),
  decision evaluation_decision not null default 'approve',
  reviewer_note text,
  override_reason text,
  decision_hash text,
  evaluated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists evaluations_grant_id_idx on public.evaluations(grant_id);
create index if not exists evaluations_evidence_pack_id_idx on public.evaluations(evidence_pack_id);
create index if not exists evaluations_decision_idx on public.evaluations(decision);
create unique index if not exists evaluations_decision_hash_uq on public.evaluations(decision_hash) where decision_hash is not null;

create trigger evaluations_set_updated_at
before update on public.evaluations
for each row
execute function public.set_updated_at();

create table if not exists public.releases (
  id uuid primary key default gen_random_uuid(),
  grant_id uuid not null references public.grants(id) on delete cascade,
  evaluation_id uuid references public.evaluations(id) on delete set null,
  release_number integer not null default 1 check (release_number > 0),
  amount numeric(38,7) not null check (amount >= 0),
  asset_code text not null,
  asset_issuer text,
  tx_hash text not null unique,
  tx_url text,
  status release_status not null default 'queued',
  executed_by_user_id uuid references public.users(id) on delete set null,
  submitted_at timestamptz,
  executed_at timestamptz,
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists releases_grant_id_idx on public.releases(grant_id);
create index if not exists releases_status_idx on public.releases(status);
create unique index if not exists releases_release_number_per_grant_uq on public.releases(grant_id, release_number);

create trigger releases_set_updated_at
before update on public.releases
for each row
execute function public.set_updated_at();

create table if not exists public.pause_events (
  id uuid primary key default gen_random_uuid(),
  grant_id uuid not null references public.grants(id) on delete cascade,
  state pause_state not null default 'paused',
  reason text not null,
  raised_by_user_id uuid references public.users(id) on delete set null,
  resolution_note text,
  resolved_by_user_id uuid references public.users(id) on delete set null,
  raised_at timestamptz not null default now(),
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pause_events_grant_id_idx on public.pause_events(grant_id);
create index if not exists pause_events_state_idx on public.pause_events(state);

create trigger pause_events_set_updated_at
before update on public.pause_events
for each row
execute function public.set_updated_at();

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  grant_id uuid references public.grants(id) on delete cascade,
  event_type audit_event_type not null,
  entity_type text not null default 'grant',
  entity_id uuid,
  actor_user_id uuid references public.users(id) on delete set null,
  payload jsonb not null default '{}'::jsonb,
  event_hash text,
  created_at timestamptz not null default now()
);

create index if not exists audit_events_grant_id_idx on public.audit_events(grant_id);
create index if not exists audit_events_event_type_idx on public.audit_events(event_type);
create index if not exists audit_events_created_at_idx on public.audit_events(created_at desc);
create unique index if not exists audit_events_event_hash_uq on public.audit_events(event_hash) where event_hash is not null;

create or replace view public.public_grants as
select
  g.id,
  g.slug,
  g.title,
  g.summary,
  g.asset_kind,
  g.asset_code,
  g.total_amount,
  g.cap_per_window,
  g.released_amount,
  g.status,
  g.visibility,
  g.contract_address,
  g.contract_grant_id,
  g.metadata_hash,
  g.current_window_started_at,
  g.current_window_ends_at,
  g.created_at,
  g.updated_at,
  o.name as sponsor_name,
  o.slug as sponsor_slug,
  b.display_name as beneficiary_name,
  r.display_name as reviewer_name
from public.grants g
left join public.organizations o on o.id = g.sponsor_org_id
left join public.users b on b.id = g.beneficiary_user_id
left join public.users r on r.id = g.reviewer_user_id
where g.visibility = 'public';

create or replace view public.grant_latest_activity as
select distinct on (ae.grant_id)
  ae.grant_id,
  ae.event_type,
  ae.entity_type,
  ae.entity_id,
  ae.actor_user_id,
  ae.payload,
  ae.event_hash,
  ae.created_at
from public.audit_events ae
order by ae.grant_id, ae.created_at desc;

