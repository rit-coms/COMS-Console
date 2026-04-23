-- Your SQL goes here
create table Genre(
    genre_id serial primary key,
    genre_name varchar(100) unique not null
);