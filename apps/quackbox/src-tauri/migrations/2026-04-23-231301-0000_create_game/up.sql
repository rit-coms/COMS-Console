-- Your SQL goes here
create table Game(
    game_id serial primary key,
    title varchar(250) unique not null,
    author varchar(150) not null,
    summary varchar(500) not null,
    release_date timestamptz not null,
    cover_image bytea not null,
    multiplayer_id int not null references Multiplayer(multiplayer_id)
);