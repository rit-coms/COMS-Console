-- Your SQL goes here
create table Belongs_To(
    game_id int not null references Game(game_id) on delete cascade,
    genre_id int not null references Genre(genre_id) on delete cascade
);