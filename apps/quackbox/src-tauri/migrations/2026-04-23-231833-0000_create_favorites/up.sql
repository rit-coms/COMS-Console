-- Your SQL goes here
create table Favorites(
    user_id int not null references Users(user_id) on delete cascade,
    game_id int not null references Game(game_id) on delete cascade,
    favorite_time timestamptz not null,
    primary key (user_id, game_id)
);