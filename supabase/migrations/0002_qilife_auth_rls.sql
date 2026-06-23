alter table qilife.records
add column if not exists owner_id uuid references auth.users(id);

alter table qilife.records
alter column owner_id set default auth.uid();

alter table qilife.records enable row level security;

drop policy if exists "Users can read own qilife records" on qilife.records;
drop policy if exists "Users can insert own qilife records" on qilife.records;
drop policy if exists "Users can update own qilife records" on qilife.records;
drop policy if exists "Users can delete own qilife records" on qilife.records;

create policy "Users can read own qilife records"
on qilife.records
for select
to authenticated
using (owner_id = auth.uid());

create policy "Users can insert own qilife records"
on qilife.records
for insert
to authenticated
with check (owner_id = auth.uid());

create policy "Users can update own qilife records"
on qilife.records
for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create policy "Users can delete own qilife records"
on qilife.records
for delete
to authenticated
using (owner_id = auth.uid());
