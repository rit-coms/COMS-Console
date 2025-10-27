use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::IntoResponse, Json,
};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};

use crate::{db::{self, models::Save, schema::leaderboard::value_name, }, frontend_api::GameSenderState, game_dev_api::GameState};

use super::{ApiState, GameStateShared};

#[derive(Deserialize, Serialize)]
pub struct SaveDataGetParams {
    pub regex: Option<String>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
    pub ascending: Option<bool>,
}

pub async fn get_save_data_info(
    State(state): State<ApiState>,
    State(game_state): State<GameStateShared>,
    Path(player_slot): Path<i16>,
    params: Query<SaveDataGetParams>,
) -> impl IntoResponse {
    let game_id = game_state.id.read().await.unwrap().to_string();
    drop(game_state);
    let user_id_s = Some(player_slot.to_string());

    let save_data_entries = db::get_save_data(
        &Some(game_id),
        &user_id_s,
        &None,
        &params.regex,
        params.ascending,
        params.limit,
        params.offset,
        &state.database_path,
    )
    .await;

    match save_data_entries {
        Ok(save_data) => {
            let mut json_response = Vec::new();

            for entry in save_data {
                json_response.push(serde_json::json!({
                    "file_name": entry.file_name,
                    "time_stamp": entry.time_stamp
                }));
            }

            Json(json_response).into_response()
        }
        Err(e) => (StatusCode::BAD_REQUEST, e.to_string()).into_response(),
    }
}

#[derive(Serialize, Deserialize)]
pub struct SaveDataPost {
    pub data: serde_json::Value,
    pub file_name: String
}

pub async fn upsert_save_data(
    State(state): State<ApiState>,
    State(game_state): State<GameStateShared>,
    Path(player_slot): Path<i16>,
    Json(payload): Json<SaveDataPost>
) -> impl IntoResponse {
    let game_id = game_state.id.read().await.unwrap().to_string();
    drop(game_state);
    let user_id = player_slot.to_string();

    let new_save: Save = db::set_save(
        &user_id,
        &game_id,
        payload.file_name.as_str(),
        &serde_json::to_vec(&payload.data).unwrap(),
        &state.database_path,
    )
    .await;

    Json(serde_json::json!({
        "data": payload.data,
        "time_stamp":new_save.time_stamp,
        "file_name": payload.file_name,
    }))
}

pub async fn get_save_data(
    State(state): State<ApiState>,
    State(game_state): State<GameStateShared>,
    Path(player_slot): Path<i16>,
    Query(params): Query<SaveDataGetParams>
) -> impl IntoResponse {
    println!("Getting save data!");
    let game_id = game_state.id.read().await.unwrap().to_string();
    drop(game_state);

    let user_id_s = player_slot.to_string();

    let save_data_entries = db::get_save_data(
        &Some(game_id),
        &Some(user_id_s),
        &None,
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

            for entry in save_data {
                json_response.push(serde_json::json!({
                            "data":serde_json::from_slice::<Value>(&entry.data).expect("Failed to deserialize BSON data"),
                            "file_name": entry.file_name,
                            "time_stamp": entry.time_stamp
                        }));
            }
            return Json(json_response).into_response();
        }
        Err(e) => (StatusCode::BAD_REQUEST, e.to_string()).into_response(),
    }
}

#[derive(Deserialize, Serialize)]
pub struct LeaderboardPost {
    pub value_num: f64
}

pub async fn insert_leaderboard_entry(
    State(state): State<ApiState>,
    State(game_state): State<GameStateShared>,
    Path((player_slot, leaderboard_name)): Path<(i16, String)>,
    Json(payload): Json<LeaderboardPost>
) -> impl IntoResponse {
    let game_id = game_state.id.read().await.unwrap().to_string(); drop(game_state);
    let user_id = player_slot.to_string();

    db::insert_leaderboard_entry(
        &user_id,
        &game_id,
        &leaderboard_name,
        payload.value_num,
        &state.database_path,
    )
    .expect("Faied to enter leaderboard entry");

    Json(serde_json::json!({
        "leaderboard_name":leaderboard_name,
        "value_num":payload.value_num,
        "user_id":user_id,
    }))
}

pub struct LeaderboardGetParams {
    limit: Option<i64>,
    offset: Option<i64>,
    ascending: Option<bool>,
}

pub async fn get_leaderboard_global(
    State(state): State<ApiState>,
    State(game_state): State<GameStateShared>,
    Path(leaderboard_name): Path<String>,
    params: Query<LeaderboardGetParams>
) -> impl IntoResponse {
    let game_id = game_state.id.read().await.unwrap().to_string();
    drop(game_state);

    let leaderboard_entries = db::get_leaderboard(
        Some(game_id),
        None,
        params.limit,
        params.ascending,
        Some(leaderboard_name.clone()),
        params.offset,
        &state.database_path,
    )
    .await;

    let mut json_response: Vec<serde_json::Value> = Vec::new();

    for entry in leaderboard_entries {
        json_response.push(serde_json::json!({
            "leaderboard_name": entry.value_name,
            "value_num": entry.value_num,
            "user_id": str::parse::<i16>(&entry.user_id).unwrap(),
            "time_stamp": entry.time_stamp
        }));
    }

    Json(json_response).into_response()
}

pub async fn get_leaderboard_user(
    State(state): State<ApiState>,
    State(game_state): State<GameStateShared>,
    Path((user_id, leaderboard_name)): Path<(String, String)>,
    params: Query<LeaderboardGetParams>
) -> impl IntoResponse {
    let game_id = game_state.id.read().await.unwrap().to_string();
    drop(game_state);

    let leaderboard_entries = db::get_leaderboard(
        Some(game_id),
        Some(user_id),
        params.limit,
        params.ascending,
        Some(leaderboard_name.clone()),
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

pub async fn get_leaderboard_player_slot(
    State(state): State<ApiState>,
    State(game_state): State<GameStateShared>,
    Path((player_slot, leaderboard_name)): Path<(String, String)>,
    params: Query<LeaderboardGetParams>
) -> impl IntoResponse {
    let game_id = game_state.id.read().await.unwrap().to_string();
    drop(game_state);
    let user_id = player_slot.to_string();

    let leaderboard_entries = db::get_leaderboard(
        Some(game_id),
        Some(user_id),
        params.limit,
        params.ascending,
        Some(leaderboard_name.clone()),
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

