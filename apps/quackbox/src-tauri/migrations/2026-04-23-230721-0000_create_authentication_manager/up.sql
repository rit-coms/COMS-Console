-- Your SQL goes here
create table Authentication_Manager(
    user_id int not null references Users(user_id) on delete cascade,
    primary key (user_id)
);