# Database

Schema, client, and documentation for the Letters database.

## Table of Contents

- [Overview](#overview)
- [Tables](#tables)
- [Letter lifecycle](#letter-lifecycle)
- [Cleanup logic](#cleanup-logic)
- [Common operations](#common-operations)
- [File structure](#file-structure)
- [Related code](#related-code)

## Overview

Letters uses **Cloudflare D1**, a serverless SQLite database, for storage. The schema is defined with **Drizzle ORM** in `schema.ts`, and the client is created in `client.ts`.

Four tables are managed automatically by **Better Auth** (`user`, `session`, `account`, `verification`). One table — `letters` — is used directly by the app.

## Tables

| Table | Managed by | Purpose |
|-------|-----------|---------|
| `user` | Better Auth | Google account info (name, email, image) |
| `session` | Better Auth | Active login sessions + cookies |
| `account` | Better Auth | OAuth tokens from Google |
| `verification` | Better Auth | Auth internal — unused by this app |
| `letters` | App code | The letters users create |

### `letters` schema

| Column | Type | Notes |
|--------|------|-------|
| `id` | text | Primary key (UUID) |
| `user_id` | text | Foreign key → `user.id` (cascade delete) |
| `slug` | text | Unique URL part, e.g. `pabitra-barsha` |
| `sender_name` | text | From the form |
| `recipient_name` | text | From the form |
| `message` | text | The letter content |
| `header` | text | Optional header text |
| `pattern` | text | `two-choice` / `one-choice` / `note-only` |
| `config` | text | JSON of customizations |
| `status` | text | `pending` / `opened` / `replied` |
| `reply` | text | Recipient's reply |
| `reply_note` | text | Recipient's note |
| `created_at` | integer | Unix ms |
| `opened_at` | integer | Unix ms |
| `replied_at` | integer | Unix ms |
| `expires_at` | integer | Unix ms |

## Letter lifecycle

Letters expire on a **progressive schedule** — the more they are interacted with, the shorter they live. This keeps storage small and matches the ephemeral nature of the product.

| Event | `expires_at` becomes |
|-------|---------------------|
| Created | `created_at + 7 days` |
| Opened for the first time | `created_at + 3.5 days` |
| Replied to | `created_at + 1.75 days` |

Whichever point is reached first, the letter is deleted.

## Cleanup logic

Cleanup runs in two places, both inside `src/core/worker/`.

### 1. Daily cron — 3 AM

Defined in `worker/index.ts` → `scheduled` → `runNormalCleanup()`.

Deletes:

- Letters where `expires_at < now`
- Sessions where `expires_at < now`
- Users where:
  - `created_at < now - 1 day`
  - **AND** no letters point to them
  - **AND** no sessions point to them

### 2. Threshold trigger — after every letter creation

Defined in `worker/routes/letters.ts` → `POST /letters`.

When **total users ≥ 100** OR **total letters ≥ 100**:

- Checks D1 storage size
- If storage > **90%** full → runs `runPressureCleanup()`
  - Deletes letters below average remaining time
  - Deletes users above average age (only if no active letters)

## Common operations

### Handle a data request (GDPR / DPDP)

Run these in the Cloudflare D1 console:

```sql
-- Step 1: Find the user
SELECT * FROM user WHERE email = 'user@example.com';

-- Step 2: Get their letters (replace USER_ID)
SELECT * FROM letters WHERE user_id = 'USER_ID';

-- Step 3: Get their sessions
SELECT * FROM session WHERE user_id = 'USER_ID';
```

Reply with the results as JSON. If no user row comes back, the account was already auto-deleted — reply that nothing exists to provide.

### Delete a user manually

Order matters — child rows first, parent row last:

```sql
DELETE FROM letters WHERE user_id = 'USER_ID';
DELETE FROM session WHERE user_id = 'USER_ID';
DELETE FROM account WHERE user_id = 'USER_ID';
DELETE FROM user WHERE id = 'USER_ID';
```

### Run migrations

```bash
# Local
npx wrangler d1 migrations apply letters-db --local

# Production
npx wrangler d1 migrations apply letters-db --remote
```

### Reset local database

Use when the local schema gets out of sync:

```bash
Remove-Item -Recurse -Force .wrangler\state
npx wrangler d1 migrations apply letters-db --local
```

### Useful queries

```sql
-- Total letters
SELECT COUNT(*) FROM letters;

-- Total users
SELECT COUNT(*) FROM user;

-- Active letters (not yet expired)
SELECT COUNT(*) FROM letters WHERE expires_at > (strftime('%s', 'now') * 1000);

-- 10 most recent letters
SELECT id, slug, sender_name, recipient_name, status, expires_at
FROM letters
ORDER BY created_at DESC
LIMIT 10;

-- Force-delete all expired letters
DELETE FROM letters WHERE expires_at < (strftime('%s', 'now') * 1000);

-- Force-delete all orphaned users
DELETE FROM user
WHERE created_at < (strftime('%s', 'now') - 86400)
  AND NOT EXISTS (SELECT 1 FROM letters WHERE letters.user_id = user.id)
  AND NOT EXISTS (SELECT 1 FROM session WHERE session.user_id = user.id);
```

## File structure

```text
src/core/db/
├── README.md      ← This file
├── schema.ts      ← Drizzle table definitions
└── client.ts      ← Drizzle client + Bindings type
```

## Related code

| Concern | Location |
|---------|----------|
| Schema definitions | `schema.ts` |
| Client + Bindings | `client.ts` |
| Cleanup logic | `src/core/worker/cleanup.ts` |
| Letter routes | `src/core/worker/routes/letters.ts` |
| Constants (thresholds, life) | `src/core/worker/constants.ts` |
| Migrations | `migrations/*.sql` |

---

<div align="center">

**Made by [Pabitra Mohan Singh](https://www.linkedin.com/in/pabitramohansingh)**

</div>