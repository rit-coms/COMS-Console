-- Your SQL goes here
create table Saves(
    filename varchar(200) not null,
    user_id int not null references Users(user_id) on delete cascade,
    game_id int not null references Game(game_id),
    data bytea not null,
    save_timestamp timestamptz not null,
    primary key (filename, user_id, game_id)
);