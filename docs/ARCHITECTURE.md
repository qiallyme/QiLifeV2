# QiLife MVP Architecture

## Pattern

QiLife borrows the useful pattern from the Cadence Obsidian plugin:

- single app shell
- internal sidebar navigation
- registry-driven entities
- generic table/card/detail surfaces
- quick capture
- settings/config first

QiLife does **not** copy Cadence's Obsidian plugin structure. This app is modular React/TypeScript with a Supabase-ready storage layer.

## Data model

MVP uses one generic table:

```txt
qilife.records
```

Each record has:

```txt
id
entity_key
title
status
priority
due_date
data jsonb
source
created_at
updated_at
archived_at
```

This is intentionally flexible. Later, stable domains can graduate into dedicated tables.

## Entity registry

The registry defines what a domain means to the UI:

```txt
key
label
plural
section
description
defaultLayout
titleField
fields
columns
```

The generic `EntityPage`, `EntityTable`, `EntityCards`, and `EntityFormModal` read this registry and render the correct surface.

## Store layer

`qilifeStore.ts` routes to:

- Supabase when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are configured
- localStorage when they are missing

This lets Cody test immediately without getting blocked by database setup.

## Do not overbuild yet

Not in MVP:

- AI classification
- graph database
- multi-user auth
- advanced permissions
- file uploads
- automations
- calendar sync

Those come after the shell and core record engine are stable.
