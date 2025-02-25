-- Your SQL goes here
CREATE TABLE leaderboard (
  row_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  user_id CHAR(32) NOT NULL REFERENCES users(id),
  game_id CHAR(32) NOT NULL REFERENCES games(id),
  value_name TEXT NOT NULL,
  value_num UNSIGNED BIG INT NOT NULL DEFAULT 0,
  UNIQUE(user_id, game_id, value_name)
);