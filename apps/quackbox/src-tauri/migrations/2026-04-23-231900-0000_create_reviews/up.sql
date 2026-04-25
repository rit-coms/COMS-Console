-- Your SQL goes here
create table Reviews(
    user_id int not null references Users(user_id),
    game_id int not null references Game(game_id) on delete cascade,
    review_time timestamptz not null default now(),
    is_liked boolean not null,
    primary key (user_id, game_id)
);