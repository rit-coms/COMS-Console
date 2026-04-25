-- Your SQL goes here
create table RIT_Login(
    rit_login_id serial primary key,
    user_id int not null unique references Authentication_Manager(user_id) on delete cascade,
    rit_uid char(32) not null unique
);