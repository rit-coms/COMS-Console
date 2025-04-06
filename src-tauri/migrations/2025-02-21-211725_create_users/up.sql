-- Your SQL goes here
CREATE TABLE users (
  id CHAR(32) NOT NULL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE ,
  rit_id TEXT
)