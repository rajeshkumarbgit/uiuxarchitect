/*
# Create contact_messages table

1. New Tables
- `contact_messages`
  - `id` (uuid, primary key)
  - `name` (text, not null) - sender's name
  - `email` (text, not null) - sender's email
  - `company` (text, nullable) - sender's company
  - `message` (text, not null) - the message body
  - `sent` (boolean, default false) - whether the email notification was sent
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `contact_messages`.
- This is a no-auth public portfolio site. Anyone can submit a contact message
  (INSERT), but only the backend service role can read/update/delete. Public
  SELECT/UPDATE/DELETE are denied (no policies) so visitors cannot read or
  modify other people's submissions.
*/

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  message text NOT NULL,
  sent boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_contact_messages" ON contact_messages;
CREATE POLICY "anon_insert_contact_messages" ON contact_messages
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Intentionally NO SELECT/UPDATE/DELETE policies for anon/authenticated:
-- only the service role (used by the edge function) can read or manage rows.
