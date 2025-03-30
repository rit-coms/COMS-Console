use diesel::prelude::*;
use serde::Serialize;


#[derive(Queryable, Selectable, Debug, Serialize)]
#[diesel(table_name = crate::db::schema::leaderboard)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct LeaderboardEntry {
    pub row_id: i32,
    pub user_id: String,
    pub game_id: String,
    pub value_name: String,
    pub value_num: f64
}

#[derive(Queryable, Selectable, Debug)]
#[diesel(table_name = crate::db::schema::users)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct User {
    pub id: String,
    pub name: String,
    pub rit_id: Option<String>
}

#[derive(Queryable, Selectable, Debug)]
#[diesel(table_name = crate::db::schema::games)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Game {
    pub id: String,
    pub name: String,
    pub installed: bool
}

#[derive(Queryable, Selectable, Debug)]
#[diesel(table_name = crate::db::schema::saves)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Save {
    pub row_id: i32,
    pub user_id: String,
    pub game_id: String,
    pub file_name: String,
    pub data: Vec<u8>
}