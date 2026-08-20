/*
# Create contact_messages table (single-tenant, no auth)

1. New Tables
- `contact_messages`
  - `id` (uuid, primary key)
  - `name` (text, not null) — sender's name
  - `email` (text, not null) — sender's email for replies
  - `company` (text, nullable) — optional company name
  - `message` (text, not null) — the message body
  - `read` (boolean, default false) — tracks whether the owner has read the message
  - `created_at` (timestamptz, default now()) — submission timestamp
2. Security
- Enable RLS on `contact_messages`.
- Allow anon + authenticated to INSERT (anyone can submit a contact form).
- Allow anon + authenticated to SELECT (single-tenant portfolio, messages are intentionally readable by the site owner via the anon key).
- No UPDATE or DELETE policies needed at this stage.
3. Notes
- This is a no-auth portfolio site; the frontend uses the anon key.
- All policies use `TO anon, authenticated` so the anon-key client can operate.
*/

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  message text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_contact_messages" ON contact_messages;
CREATE POLICY "anon_insert_contact_messages" ON contact_messages
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_contact_messages" ON contact_messages;
CREATE POLICY "anon_select_contact_messages" ON contact_messages
  FOR SELECT TO anon, authenticated USING (true);
