-- Your SQL goes here
CREATE TABLE saves (
  row_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  user_id CHAR(32) NOT NULL REFERENCES users(id),
  game_id CHAR(32) NOT NULL REFERENCES games(id),
  file_name VARCHAR(255) NOT NULL,
  data BLOB NOT NULL
)