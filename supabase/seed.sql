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
  metadata_hash,
  created_by_user_id
)
select
  'university-prototype-sprint',
  'University Prototype Sprint',
  'University team grant focused on milestone-based releases and reviewer oversight.',
  org_id,
  reviewer_id,
  beneficiary_id,
  'xlm',
  'XLM',
  6800,
  1800,
  0,
  14,
  'funding',
  'public',
  'meta-hash-seed-002',
  admin_id
from seeded_refs
where not exists (
  select 1 from public.grants where slug = 'university-prototype-sprint'
);

with grant_ref as (
  select id as grant_id
  from public.grants
  where slug = 'milestone-builders-fund'
)
insert into public.milestones (
  grant_id,
  order_index,
  name,
  description,
  success_metric,
  verification_method,
  evidence_requirements,
  status
)
select
  grant_id,
  0,
  'Deposit locked',
  'Grant funded into the testnet vault.',
  'Vault balance visible on Stellar testnet.',
  'Verify escrow status and funding transaction.',
  'Funding transaction hash and vault address.',
  'completed'
from grant_ref
where not exists (
  select 1 from public.milestones where grant_id = grant_ref.grant_id and order_index = 0
)
union all
select
  grant_id,
  1,
  'Evidence submitted',
  'First evidence pack attached for review.',
  'Repository, docs, and demo links submitted for milestone review.',
  'Reviewer checks links, commit refs, and execution evidence.',
  'Repo URL, docs URL, demo URL, and reviewer note.',
  'submitted'
from grant_ref
where not exists (
  select 1 from public.milestones where grant_id = grant_ref.grant_id and order_index = 1
);

with grant_ref as (
  select id as grant_id
  from public.grants
  where slug = 'university-prototype-sprint'
)
insert into public.milestones (
  grant_id,
  order_index,
  name,
  description,
  success_metric,
  verification_method,
  evidence_requirements,
  status
)
select
  grant_id,
  0,
  'Grant drafted',
  'Grant metadata captured and ready for funding.',
  'Stakeholders and funding terms agreed.',
  'Review grant metadata and assigned roles.',
  'Grant summary and reviewer assignment.',
  'planned'
from grant_ref
where not exists (
  select 1 from public.milestones where grant_id = grant_ref.grant_id and order_index = 0
)
union all
select
  grant_id,
  1,
  'Funding pending',
  'Sponsor still needs to fund the Stellar testnet grant flow.',
  'Initial funding transaction submitted.',
  'Check sponsor wallet and upcoming contract funding step.',
  'Wallet signature plus funding reference.',
  'in_progress'
from grant_ref
where not exists (
  select 1 from public.milestones where grant_id = grant_ref.grant_id and order_index = 1
);

with seeded_refs as (
  select
    (select id from public.grants where slug = 'milestone-builders-fund') as builders_grant_id,
    (select id from public.grants where slug = 'university-prototype-sprint') as sprint_grant_id,
    (select id from public.users where login_name = 'milestone-admin') as admin_id,
    (select id from public.users where login_name = 'stellar-reviewer') as reviewer_id
)
insert into public.audit_events (grant_id, event_type, entity_type, entity_id, actor_user_id, payload, event_hash)
select
  builders_grant_id,
  'grant_created',
  'grant',
  builders_grant_id,
  admin_id,
  jsonb_build_object(
    'title', 'Milestone Builders Fund',
    'summary', 'Sponsor created terms for the first public Milestone walkthrough.'
  ),
  'audit-seed-builders-created'
from seeded_refs
where builders_grant_id is not null
  and not exists (
    select 1 from public.audit_events where event_hash = 'audit-seed-builders-created'
  )
union all
select
  builders_grant_id,
  'grant_funded',
  'grant',
  builders_grant_id,
  admin_id,
  jsonb_build_object('amount', '12500', 'asset_code', 'XLM'),
  'audit-seed-builders-funded'
from seeded_refs
where builders_grant_id is not null
  and not exists (
    select 1 from public.audit_events where event_hash = 'audit-seed-builders-funded'
  )
union all
select
  builders_grant_id,
  'evidence_submitted',
  'grant',
  builders_grant_id,
  reviewer_id,
  jsonb_build_object('summary', 'First evidence links attached for reviewer evaluation.'),
  'audit-seed-builders-evidence'
from seeded_refs
where builders_grant_id is not null
  and not exists (
    select 1 from public.audit_events where event_hash = 'audit-seed-builders-evidence'
  )
union all
select
  sprint_grant_id,
  'grant_created',
  'grant',
  sprint_grant_id,
  admin_id,
  jsonb_build_object(
    'title', 'University Prototype Sprint',
    'summary', 'Grant created and waiting for funding and first evidence window.'
  ),
  'audit-seed-sprint-created'
from seeded_refs
where sprint_grant_id is not null
  and not exists (
    select 1 from public.audit_events where event_hash = 'audit-seed-sprint-created'
  );

with seeded_refs as (
  select
    (select id from public.grants where slug = 'university-prototype-sprint') as sprint_grant_id,
    (select id from public.users where login_name = 'stellar-reviewer') as reviewer_id
)
insert into public.pause_events (grant_id, state, reason, raised_by_user_id, resolution_note)
select
  sprint_grant_id,
  'paused',
  'Reviewer requested stronger evidence before the first release.',
  reviewer_id,
  null
from seeded_refs
where sprint_grant_id is not null
  and not exists (
    select 1 from public.pause_events where grant_id = sprint_grant_id and state = 'paused'
  );
