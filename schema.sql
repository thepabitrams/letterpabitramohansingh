CREATE TABLE IF NOT EXISTS user (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  email_verified INTEGER NOT NULL DEFAULT 0,
  image TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS session (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at INTEGER NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS account (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  account_id TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  id_token TEXT,
  access_token_expires_at INTEGER,
  refresh_token_expires_at INTEGER,
  scope TEXT,
  password TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS verification (
  id TEXT PRIMARY KEY NOT NULL,
  identifier TEXT NOT NULL,
  value TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at INTEGER,
  updated_at INTEGER
);

CREATE TABLE IF NOT EXISTS letters (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  sender_name TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  message TEXT NOT NULL,
  header TEXT,
  pattern TEXT NOT NULL DEFAULT 'two-choice',
  config TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  reply TEXT,
  reply_note TEXT,
  expiry_days INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  opened_at INTEGER,
  replied_at INTEGER,
  expires_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_letters_slug ON letters(slug);
CREATE INDEX IF NOT EXISTS idx_letters_user_id ON letters(user_id);
CREATE INDEX IF NOT EXISTS idx_letters_expires_at ON letters(expires_at);
CREATE INDEX IF NOT EXISTS idx_session_user_id ON session(user_id);
CREATE INDEX IF NOT EXISTS idx_account_user_id ON account(user_id);