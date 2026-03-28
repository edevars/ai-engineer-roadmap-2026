CREATE TABLE IF NOT EXISTS user_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  roadmap_start_date TEXT NOT NULL,
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS streaks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  area_id TEXT NOT NULL,
  streak_type TEXT NOT NULL,
  current_count INTEGER DEFAULT 0,
  best_count INTEGER DEFAULT 0,
  last_week_key TEXT,
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(user_id, area_id, streak_type)
);
