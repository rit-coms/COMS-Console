use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::IntoResponse, Json,
};
use serde_json::{json, Value};

use crate::db::{self, models::Save};

use super::{ApiState, GameStateShared};

pub struct SaveDataGetParams {
    regex: Option<String>,
    limit: Option<i64>,
    offset: Option<i64>,
    ascending: Option<bool>,
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

pub struct SaveDataPost {
    data: serde_json::Value,
    file_name: String
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
    params: Query<SaveDataGetParams>
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