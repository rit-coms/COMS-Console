use chrono::{DateTime, Utc};
use diesel::prelude::*;
use serde::Serialize;

#[derive(Queryable, Selectable, Debug, Serialize)]
#[diesel(table_name = crate::db::schema::authentication_manager)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct AuthenticationManager {
    pub user_id: i32,
}

#[derive(Queryable, Selectable, Debug, Serialize)]
#[diesel(table_name = crate::db::schema::belongs_to)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct BelongsTo {
    pub game_id: i32,
    pub genre_id: i32,
}

#[derive(Queryable, Selectable, Debug, Serialize)]
#[diesel(table_name = crate::db::schema::favorites)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Favorites {
    pub user_id: i32,
    pub game_id: i32,
    pub favorite_time: DateTime<Utc>,
}

#[derive(Queryable, Selectable, Debug, Serialize, Insertable)]
#[diesel(table_name = crate::db::schema::game)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Game {
    pub game_id: i32,
    pub title: String,
    pub author: String,
    pub summary: String,
    pub release_date: DateTime<Utc>,
    pub cover_image: Vec<u8>,
    pub multiplayer_id: i32,
}

#[derive(Queryable, Selectable, Debug, Serialize)]
#[diesel(table_name = crate::db::schema::game_image)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct GameImage {
    pub game_image_id: i32,
    pub game_id: i32,
    pub image: Vec<u8>,
    pub shape: String,
}

#[derive(Queryable, Selectable, Debug, Serialize)]
#[diesel(table_name = crate::db::schema::genre)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Genre {
    pub genre_id: i32,
    pub genre_name: String,
}

#[derive(Queryable, Selectable, Debug, Serialize, Insertable)]
#[diesel(table_name = crate::db::schema::leaderboard_entry)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct LeaderboardEntry {
    pub lb_entry_id: i32,
    pub user_id: i32,
    pub game_id: i32,
    pub value_num: f64,
    pub value_name: String,
    pub lb_timestamp: DateTime<Utc>,
}

#[derive(Queryable, Selectable, Debug, Serialize)]
#[diesel(table_name = crate::db::schema::local_login)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct LocalLogin {
    pub local_login_id: i32,
    pub user_id: i32,
    pub salthash: String,
}

#[derive(Queryable, Selectable, Debug, Serialize, Insertable)]
#[diesel(table_name = crate::db::schema::multiplayer)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Multiplayer {
    pub multiplayer_id: i32,
    pub local_min: i32,
    pub local_max: i32,
    pub online_multiplayer: bool,
}

#[derive(Queryable, Selectable, Debug, Serialize)]
#[diesel(table_name = crate::db::schema::plays)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Plays {
    pub user_id: i32,
    pub game_id: i32,
    pub time_begin: DateTime<Utc>,
    pub time_end: DateTime<Utc>,
}

#[derive(Queryable, Selectable, Debug, Serialize)]
#[diesel(table_name = crate::db::schema::reviews)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Reviews {
    pub user_id: i32,
    pub game_id: i32,
    pub review_time: DateTime<Utc>,
    pub is_liked: bool,
}

#[derive(Queryable, Selectable, Debug, Serialize)]
#[diesel(table_name = crate::db::schema::rit_login)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct RitLogin {
    pub rit_login_id: i32,
    pub user_id: i32,
    pub rit_uid: String,
}

#[derive(Queryable, Selectable, Debug, Serialize, Insertable)]
#[diesel(table_name = crate::db::schema::saves)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Save {
    pub save_id: i32,
    pub filename: String,
    pub user_id: i32,
    pub game_id: i32,
    pub data: Vec<u8>,
    pub save_timestamp: DateTime<Utc>,
}

#[derive(Queryable, Selectable, Debug, Serialize, Insertable)]
#[diesel(table_name = crate::db::schema::users)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct User {
    pub user_id: i32,
    pub username: String,
    pub about_me: Option<String>,
    pub profile_pic: Option<Vec<u8>>,
    pub crumbs: i32,
}
