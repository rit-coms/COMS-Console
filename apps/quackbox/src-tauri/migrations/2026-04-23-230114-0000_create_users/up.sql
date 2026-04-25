-- Your SQL goes here
create table Users(
    user_id serial primary key,
    username varchar(150) unique not null,
    about_me varchar(500),
    profile_pic bytea,
    crumbs int not null default 0
);