-- Your SQL goes here
CREATE TABLE games (
  id CHAR(32) NOT NULL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  installed TINYINT NOT NULL
)