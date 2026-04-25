use crate::db::{self, models::LeaderboardEntry};
use axum::{
    extract::{Query, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use axum_macros::FromRef;
use diesel::{prelude::Insertable, Selectable};
use serde::{Deserialize, Serialize};
use std::option::Option;
use std::sync::Arc;
use tokio::{
    sync::watch::Receiver,
    sync::{Notify, RwLock},
};

// TODO: rename to not be confused with the managed tauri app state
#[derive(Clone, FromRef)]
pub struct AppState {
    pub api_state: ApiState,
    pub game_state: GameStateShared,
}

#[derive(Clone)]
pub struct ApiState {
    pub database_path: String,
}

#[derive(Debug, Clone)]
pub struct GameState {
    pub id: Arc<RwLock<Option<u64>>>,
    pub notifier: Arc<Notify>,
    pub channel: Receiver<Option<u64>>,
}

pub type GameStateShared = Arc<GameState>;

#[derive(Deserialize, Serialize, Insertable, Selectable)]
#[diesel(table_name = crate::db::schema::leaderboard_entry)]
pub struct LeaderboardEntryPostPayload {
    pub user_id: i32,
    pub game_id: i32,
    pub value_num: f64,
    pub value_name: String,
}

/// Handles HTTP post requests for the axum webserver by inserting the given entry in the
/// SQLite database.
pub async fn set_leaderboard(
    State(state): State<ApiState>,
    Json(payload): Json<LeaderboardEntryPostPayload>,
) -> Json<LeaderboardEntry> {
    // TODO: Get game_id and user_id
    println!("Setting Leaderboard data");

    // Save entry to database
    Json(
        db::insert_leaderboard_entry(&payload, &state.database_path)
            .expect("Faied to enter leaderboard entry"),
    )
}

#[derive(Deserialize, Serialize)]
pub struct LeaderboardGetParams {
    pub count: Option<i64>,
    pub ascending: Option<bool>,
    pub value_name: Option<String>,
    pub offset: Option<i64>,
    pub player_slot: Option<i16>,
}

/// Handles HTTP leaderboard get requests for the axum webserver
pub async fn get_leaderboard(
    State(state): State<ApiState>,
    State(game_state): State<GameStateShared>,
    params: Query<LeaderboardGetParams>,
) -> Result<Json<Vec<LeaderboardEntry>>, StatusCode> {
    unimplemented!()
}

#[derive(Deserialize, Serialize, Insertable)]
#[diesel(table_name = crate::db::schema::saves)]
pub struct SavePostPayload {
    pub filename: String,
    pub user_id: i32, // TODO: do some sort of better authentication
    pub game_id: i32, // TODO: do some better game authentication
    pub data: Vec<u8>,
}

// Handles save-data HTTP post requests for the axum webserver
pub async fn set_save_data(
    State(state): State<ApiState>,
    Json(payload): Json<SavePostPayload>,
) -> impl IntoResponse {
    // Save entry to database;
    Json(db::set_save(&payload, &state.database_path).await)
}

#[derive(Deserialize, Serialize)]
pub struct SaveDataGetParams {
    pub file_name: Option<String>,
    pub regex: Option<String>,
    pub player_slot: Option<i16>,
}
