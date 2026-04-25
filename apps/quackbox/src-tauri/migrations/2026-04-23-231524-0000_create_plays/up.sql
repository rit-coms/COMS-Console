-- Your SQL goes here
create table Plays(
    user_id int not null references Users(user_id) on delete cascade,
    game_id int not null references Game(game_id),
    time_begin timestamptz not null,
    time_end timestamptz not null,
    primary key (user_id, game_id)
);