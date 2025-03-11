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

#[derive(Clone)]
pub struct ApiState {
    pub db_name: String,
}

#[derive(Deserialize, Serialize)]
pub struct LeaderboardEntry {
    pub value_name: String,
    pub value_num: i64,
}

#[derive(Deserialize, Serialize)]
pub struct SaveDataEntry {
    pub file_name: String,
    pub data: serde_json::Value, // This data should be stored in the database as BSON data, is this the correct type?
}

#[derive(Deserialize, Serialize)]
pub enum LeaderboardScope {
    User,
    Global,
}

/// Handles HTTP post requests for the axum webserver by inserting the given entry in the
/// SQLite database.
pub async fn set_leaderboard(
    State(state): State<ApiState>,
    Json(payload): Json<LeaderboardEntry>,
) -> impl IntoResponse {
    // TODO: Get game_id and user_id
    let game_id = "0";
    let user_id = "0";

    // Save entry to database
    // TODO: Can I return the query response from this function?
    db::insert_leaderboard_entry(
        user_id,
        game_id,
        payload.value_name.as_str(),
        payload.value_num,
        &state.db_name,
    )
    .await
    .expect("Falied to enter leaderboard entry");

    Json(serde_json::json!({
        "value_name":payload.value_name,
        "value_num":payload.value_num,
    }))
}

#[derive(Deserialize, Serialize)]
pub struct LeaderboardGetParams {
    pub scope: Option<LeaderboardScope>,
    pub count: Option<i64>,
    pub ascending: Option<bool>,
    pub value_name: Option<String>,
    pub offset: Option<i64>,
}

/// Handles HTTP leaderboard get requests for the axum webserver
pub async fn get_leaderboard(
    State(state): State<ApiState>,
    params: Query<LeaderboardGetParams>,
) -> impl IntoResponse {
    let game_id: String = String::from("0"); // Example for now
    let user_id: String = String::from("0");
    let count: Option<i64>;

    // TODO: add error http response to handle when count > 100
    if let Some(entry_count) = params.count {
        if entry_count > 100 {
            count = Some(100);
        } else {
            count = Some(entry_count);
        }
    } else {
        count = Some(100);
    }

    // Set the user_id according to the given leaderboard scope
    // TODO: get actual user_id
    let user_id_s: Option<String> = match &params.scope {
        Some(scope) => match scope {
            LeaderboardScope::User => Some(user_id),
            LeaderboardScope::Global => None,
        },
        None => None, // If no scope query param given, default to global
    };

    let leaderboard_entries = db::get_leaderboard(
        Some(game_id),
        user_id_s,
        count,
        params.ascending,
        params.value_name.clone(),
        params.offset,
        &state.db_name,
    )
    .await;

    let mut json_response: Vec<serde_json::Value> = Vec::new();

    // TODO: add time_stamp
    for entry in leaderboard_entries {
        json_response.push(serde_json::json!({
            "value_name": entry.value_name,
            "value_num": entry.value_num,
        }));
    }

    Json(json_response)
}

// Handles save-data HTTP post requests for the axum webserver
pub async fn set_save_data(
    State(state): State<ApiState>,
    Json(payload): Json<SaveDataEntry>,
) -> impl IntoResponse {
    let game_id = "0";
    let user_id = "0";

    // Save entry to database;
    // TODO: more elegant error handling for converting json data to vec of bytes
    db::set_save(
        user_id,
        game_id,
        payload.file_name.as_str(),
        &serde_json::to_vec(&payload.data).unwrap(),
        &state.db_name,
    )
    .await;

    Json(serde_json::json!({
        "file_name": payload.file_name,
        "data": payload.data
    }))
}

#[derive(Deserialize, Serialize)]
pub struct SaveDataGetParams {
    pub file_name: Option<String>,
    pub count: Option<i64>,
    pub offset: Option<i64>,
    pub ascending: Option<bool>,
}

/// Handles save-data HTTP get requests for the axum webserver.
/// Can either get a list of save files for current user or
/// get a specific file by user and name.
pub async fn get_save_data(
    State(state): State<ApiState>,
    params: Query<SaveDataGetParams>,
) -> impl IntoResponse {
    println!("Getting save data!");
    let game_id: String = String::from("0"); // Example for now
    let user_id: String = String::from("0");

    // File names should be unique per game, so if both file_name and count are
    // provided, the developer should know that they can't do that. One and only
    // one of these parameters should be provided.
    let file_name_s: Option<String>;
    let entry_count: Option<i64>;
    match (params.file_name.clone(), params.count) {
        (Some(_), Some(_)) => return StatusCode::BAD_REQUEST.into_response(),
        (Some(filename), None) => {
            file_name_s = Some(filename);
            entry_count = None;
        }
        (None, Some(num_entries)) => {
            if num_entries > 50 {
                return StatusCode::PAYLOAD_TOO_LARGE.into_response();
            }
            file_name_s = None;
            entry_count = Some(num_entries);
        }
        (None, None) => {
            file_name_s = None;
            entry_count = Some(10)
        }
    }

    let save_data_entries = db::get_save_data(
        Some(game_id),
        Some(user_id),
        entry_count,
        params.offset,
        params.ascending,
        &state.db_name,
    )
    .await;

    let mut json_response = Vec::new();

    // TODO: add time_stamp
    // TODO: parse binary data into json
    for entry in save_data_entries {
        json_response.push(serde_json::json!({
            "data":serde_json::from_slice::<Value>(&entry.data).expect("Failed to deserialize BSON data"),
            "file_name": entry.file_name
        }));
    }

    println!("{}", serde_json::to_string_pretty(&json_response).unwrap());

    Json(json_response).into_response()
}
