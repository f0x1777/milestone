alter table if exists public.milestones
  add column if not exists success_metric text,
  add column if not exists verification_method text,
  add column if not exists evidence_requirements text;
