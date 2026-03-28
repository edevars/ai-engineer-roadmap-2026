CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  salt TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS weekly_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  week_key TEXT NOT NULL,
  cell_key TEXT NOT NULL,
  checked INTEGER NOT NULL DEFAULT 1,
  UNIQUE(user_id, week_key, cell_key)
);

CREATE TABLE IF NOT EXISTS phase_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  roadmap TEXT NOT NULL DEFAULT 'main',
  phase_key TEXT NOT NULL,
  checked INTEGER NOT NULL DEFAULT 1,
  UNIQUE(user_id, roadmap, phase_key)
);
