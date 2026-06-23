# QiLife App MVP

QiLife is a Cadence-style life management shell: one sidebar, one command center, one entity registry, and generic entity pages for daily action, people, care, finance, legal, home, documents, projects, and reminders.

This is intentionally **not** a giant finished life OS. It is the first clean slice that lets you move fast without building a cathedral in the fog.

## What is included

- Vite + React + TypeScript app
- QiLife shell with sidebar and topbar
- Home dashboard
- Quick capture modal
- Generic entity registry
- Generic entity table/card views
- Create/edit/archive records
- Supabase migration for `qilife.records`
- localStorage fallback when Supabase env vars are missing
- Starter demo data in local mode

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints, usually:

```txt
http://localhost:5173
```

## Optional Supabase setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Run the migration in Supabase SQL editor or with the Supabase CLI:

```sql
supabase/migrations/0001_qilife_records.sql
```

If `.env` is missing or blank, the app uses localStorage so you can still test the UI immediately.

## Main files

```txt
src/features/qilife/types.ts
src/features/qilife/data/entityRegistry.ts
src/features/qilife/data/navRegistry.ts
src/features/qilife/services/qilifeStore.ts
src/features/qilife/components/QiLifeShell.tsx
src/features/qilife/components/HomeDashboard.tsx
src/features/qilife/components/EntityPage.tsx
src/features/qilife/components/EntityFormModal.tsx
src/features/qilife/styles/qilife.css
src/lib/supabaseClient.ts
supabase/migrations/0001_qilife_records.sql
```

## Current entities

- People
- Tasks
- Projects
- Care Notes
- Appointments
- Expenses
- Documents
- Legal Matters
- Home Items
- Reminders

## Next sane steps

1. Confirm the shell layout feels right.
2. Use local mode to add real sample records.
3. Run the Supabase migration.
4. Connect the `.env` values.
5. Decide which module gets real depth first: Care, Finance, or Documents.

Do not add AI, graph, or complex automations until the record shape proves itself. Fancy on top of mush is still mush.
