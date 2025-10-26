use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::IntoResponse, Json,
};
use serde_json::json;

use crate::db;

use super::{ApiState, GameStateShared};

pub struct SaveDataGetParamsV2 {
    regex: Option<String>,
    limit: Option<i64>,
    offset: Option<i64>,
    ascending: Option<bool>,
}

pub async fn get_save_data_info_v2(
    State(state): State<ApiState>,
    State(game_state): State<GameStateShared>,
    Path(player_slot): Path<i16>,
    params: Query<SaveDataGetParamsV2>,
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
