CREATE TABLE messages (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  token      text        UNIQUE NOT NULL,
  code       text        NOT NULL,
  passphrase text        NOT NULL,
  content    text        NOT NULL,
  created_at timestamptz NOT NULL,
  expires_at timestamptz NOT NULL,
  is_viewed  boolean     NOT NULL DEFAULT false
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_all" ON messages TO anon USING (true) WITH CHECK (true);
