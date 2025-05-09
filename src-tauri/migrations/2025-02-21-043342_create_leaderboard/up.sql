-- Your SQL goes here
CREATE TABLE leaderboard (
  row_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  user_id CHAR(32) NOT NULL REFERENCES users(id),
  game_id CHAR(32) NOT NULL REFERENCES games(id),
  value_name TEXT NOT NULL,
  value_num DOUBLE NOT NULL DEFAULT 0,
  time_stamp TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  UNIQUE(user_id, game_id, value_name, value_num)
);
