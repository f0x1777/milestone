insert into public.users (login_name, display_name, email, role, auth_subject)
values
  ('milestone-admin', 'Milestone Admin', 'team@milestone.app', 'admin', 'seed-admin'),
  ('stellar-reviewer', 'Testnet Reviewer', 'reviewer@milestone.app', 'reviewer', 'seed-reviewer'),
  ('stellar-beneficiary', 'LATAM Builder Cohort', 'beneficiary@milestone.app', 'beneficiary', 'seed-beneficiary')
on conflict (login_name) do nothing;

insert into public.organizations (slug, name, organization_type)
values
  ('milestone-foundation', 'Milestone Foundation', 'foundation')
on conflict (slug) do nothing;

with seeded_refs as (
  select
    (select id from public.organizations where slug = 'milestone-foundation') as org_id,
    (select id from public.users where login_name = 'stellar-reviewer') as reviewer_id,
    (select id from public.users where login_name = 'stellar-beneficiary') as beneficiary_id,
    (select id from public.users where login_name = 'milestone-admin') as admin_id
)
insert into public.grants (
  slug,
  title,
  summary,
  sponsor_org_id,
  reviewer_user_id,
  beneficiary_user_id,
  asset_kind,
  asset_code,
  total_amount,
  cap_per_window,
  released_amount,
  window_days,
  status,
  visibility,
  contract_address,
  metadata_hash,
  created_by_user_id
)
select
  'milestone-builders-fund',
  'Milestone Builders Fund',
  'Seed data for the first public Milestone walkthrough.',
  org_id,
  reviewer_id,
  beneficiary_id,
  'xlm',
  'XLM',
  12500,
  3500,
  2500,
  14,
  'active',
  'public',
  'CTestnetMilestoneVault001',
  'meta-hash-seed-001',
  admin_id
from seeded_refs
where not exists (
  select 1 from public.grants where slug = 'milestone-builders-fund'
);

with grant_ref as (
  select id as grant_id
  from public.grants
  where slug = 'milestone-builders-fund'
)
insert into public.milestones (grant_id, order_index, name, description, status)
select grant_id, 0, 'Deposit locked', 'Grant funded into the testnet vault.', 'completed'
from grant_ref
where not exists (
  select 1 from public.milestones where grant_id = grant_ref.grant_id and order_index = 0
)
union all
select grant_id, 1, 'Evidence submitted', 'First evidence pack attached for review.', 'submitted'
from grant_ref
where not exists (
  select 1 from public.milestones where grant_id = grant_ref.grant_id and order_index = 1
);
