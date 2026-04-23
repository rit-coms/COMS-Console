-- Your SQL goes here
create table Game_Image(
    game_image_id serial primary key,
    game_id int not null references Game(game_id),
    image bytea not null,
    shape varchar(30) not null
    constraint c1 check(shape in ('landscape', 'portrait', 'square'))
);