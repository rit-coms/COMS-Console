-- Your SQL goes here
create table Multiplayer(
    multiplayer_id serial primary key,
    local_min int not null default 1,
    local_max int not null default 1,
    online_multiplayer boolean not null default false
);