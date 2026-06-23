-- QiLife MVP generic record store.
-- This gives the app one stable table while the final domain schema evolves.

create schema if not exists qilife;
create extension if not exists pgcrypto;

create table if not exists qilife.records (
  id uuid primary key default gen_random_uuid(),
  entity_key text not null,
  title text not null,
  status text,
  priority text,
  due_date date,
  data jsonb not null default '{}'::jsonb,
  source text not null default 'qilife',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create index if not exists idx_qilife_records_entity_key on qilife.records (entity_key);
create index if not exists idx_qilife_records_status on qilife.records (status);
create index if not exists idx_qilife_records_priority on qilife.records (priority);
create index if not exists idx_qilife_records_due_date on qilife.records (due_date);
create index if not exists idx_qilife_records_data_gin on qilife.records using gin (data);

create or replace function qilife.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_qilife_records_updated_at on qilife.records;

create trigger trg_qilife_records_updated_at
before update on qilife.records
for each row
execute function qilife.set_updated_at();

-- Optional starter RLS posture. Enable only after auth rules are decided.
-- alter table qilife.records enable row level security;
