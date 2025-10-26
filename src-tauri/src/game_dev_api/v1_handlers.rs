use crate::db::{self};
use axum::{
    extract::{Query, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::option::Option;

use super::{ApiState, GameStateShared};

#[derive(Deserialize, Serialize)]
pub struct LeaderboardPost {
    pub value_name: String,
    pub value_num: f64,
    pub player_slot: i16,
}

#[derive(Deserialize, Serialize)]
pub struct SaveDataPost {
    pub file_name: String,
    pub data: serde_json::Value, // This data should be stored in the database as BSON data, is this the correct type?
    pub player_slot: i16,
}

/// Handles HTTP post requests for the axum webserver by inserting the given entry in the
/// SQLite database.
pub async fn set_leaderboard(
    State(state): State<ApiState>,
    State(game_state): State<GameStateShared>,
    Json(payload): Json<LeaderboardPost>,
) -> impl IntoResponse {
    let game_id = game_state.id.read().await.unwrap().to_string(); drop(game_state);
    let user_id = payload.player_slot.to_string();

    // Save entry to database
    // TODO: Can I return the query response from this function?
    db::insert_leaderboard_entry(
        &user_id,
        &game_id,
        payload.value_name.as_str(),
        payload.value_num,
        &state.database_path,
    )
    .expect("Faied to enter leaderboard entry");

    Json(serde_json::json!({
        "value_name":payload.value_name,
        "value_num":payload.value_num,
        "player_slot":payload.player_slot,
    }))
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
) -> impl IntoResponse {
    // let game_id: String = String::from("1"); // Example for now
    let game_id = game_state.id.read().await.unwrap().to_string();
    drop(game_state);
    let user_id_s: Option<String>;
    // TODO: get associated player id and error check for invalid slots (negative or greater than the max)
    match params.player_slot {
        Some(slot) => user_id_s = Some(slot.to_string()),
        None => user_id_s = None,
    }
    let count: Option<i64>;

    // TODO: add error http response to handle when count > 100
    if let Some(entry_count) = params.count {
        if entry_count > 100 {
            return StatusCode::PAYLOAD_TOO_LARGE.into_response();
        } else {
            count = Some(entry_count);
        }
    } else {
        count = Some(100);
    }

    let leaderboard_entries = db::get_leaderboard(
        Some(game_id),
        user_id_s,
        count,
        params.ascending,
        params.value_name.clone(),
        params.offset,
        &state.database_path,
    )
    .await;

    let mut json_response: Vec<serde_json::Value> = Vec::new();

    for entry in leaderboard_entries {
        json_response.push(serde_json::json!({
            "value_name": entry.value_name,
            "value_num": entry.value_num,
            "player_slot": str::parse::<i16>(&entry.user_id).unwrap(),
            "time_stamp": entry.time_stamp
        }));
    }

    Json(json_response).into_response()
}

// Handles save-data HTTP post requests for the axum webserver
pub async fn set_save_data(
    State(state): State<ApiState>,
    State(game_state): State<GameStateShared>,
    Json(payload): Json<SaveDataPost>,
) -> impl IntoResponse {
    let game_id = game_state.id.read().await.unwrap().to_string();
    drop(game_state);
    let user_id = payload.player_slot.to_string();

    // Save entry to database;
    // TODO: more elegant error handling for converting json data to vec of bytes
    db::set_save(
        &user_id,
        &game_id,
        payload.file_name.as_str(),
        &serde_json::to_vec(&payload.data).unwrap(),
        &state.database_path,
    )
    .await;

    Json(serde_json::json!({
        "file_name": payload.file_name,
        "data": payload.data,
        "player_slot": payload.player_slot,
    }))
}

#[derive(Deserialize, Serialize)]
pub struct SaveDataGetParamsV1 {
    pub file_name: Option<String>,
    pub regex: Option<String>,
    pub player_slot: Option<i16>,
}

/// Handles save-data HTTP get requests for the axum webserver.
/// Can either get a list of save files for current user or
/// get a specific file by user and name.
pub async fn get_save_data(
    State(state): State<ApiState>,
    State(game_state): State<GameStateShared>,
    params: Query<SaveDataGetParamsV1>,
) -> impl IntoResponse {
    println!("Getting save data!");
    let game_id = game_state.id.read().await.unwrap().to_string();
    drop(game_state);

    let user_id_s: Option<String> = match params.player_slot {
        Some(slot) => Some(slot.to_string()),
        None => None,
    };

    let save_data_entries = db::get_save_data(
        &Some(game_id),
        &user_id_s,
        &params.file_name,
        &params.regex,
        None,
        None,
        None,
        &state.database_path,
    )
    .await;

    match save_data_entries {
        Ok(save_data) => {
            let mut json_response = Vec::new();

            // TODO: add time_stamp
            // TODO: fix player slot to not use hardcoded values
            for entry in save_data {
                json_response.push(serde_json::json!({
                            "data":serde_json::from_slice::<Value>(&entry.data).expect("Failed to deserialize BSON data"),
                            "file_name": entry.file_name,
                            "player_slot": str::parse::<i16>(&entry.user_id).unwrap(),
                            "time_stamp": entry.time_stamp
                        }));
            }
            return Json(json_response).into_response();
        }
        Err(e) => (StatusCode::BAD_REQUEST, e.to_string()).into_response(),
    }
}
