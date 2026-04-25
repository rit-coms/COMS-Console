-- Your SQL goes here
create table Leaderboard_Entry(
    lb_entry_id serial primary key,
    user_id int not null references Users(user_id),
    game_id int not null references Game(game_id) on delete cascade,
    value_num double precision not null,
    value_name varchar(150) not null,
    lb_timestamp timestamptz not null default now()
);