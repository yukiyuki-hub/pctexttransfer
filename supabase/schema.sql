-- PCスマホテキスト転送 データベーススキーマ
-- Supabaseのダッシュボード → SQL Editor で実行してください

-- メッセージ転送テーブル
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

-- tokenとcode+passphraseの検索を高速化するインデックス
CREATE INDEX idx_messages_token           ON messages (token);
CREATE INDEX idx_messages_code_passphrase ON messages (code, passphrase);

-- RLS（行レベルセキュリティ）を有効化する
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 匿名ユーザーの新規作成を許可する
CREATE POLICY "anon_insert" ON messages
  FOR INSERT TO anon
  WITH CHECK (true);

-- 匿名ユーザーの参照を許可する
CREATE POLICY "anon_select" ON messages
  FOR SELECT TO anon
  USING (true);

-- 匿名ユーザーのis_viewed更新を許可する
CREATE POLICY "anon_update" ON messages
  FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);
