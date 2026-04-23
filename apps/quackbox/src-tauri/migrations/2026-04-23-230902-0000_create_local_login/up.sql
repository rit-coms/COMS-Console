-- Your SQL goes here
create table Local_Login(
    local_login_id serial primary key,
    user_id int not null unique references Authentication_Manager(user_id) on delete cascade,
    salthash char(98) not null
);