use axum::{extract::{Path, State}, response::IntoResponse};

use super::{ApiState, GameStateShared};

pub async fn get_save_data_info_v2(
    State(state): State<ApiState>,
    State(game_state): State<GameStateShared>,
    Path(player_slot): Path<i16>,
)-> impl IntoResponse {
    let game_id = game_state.id.read().await.unwrap().to_string();
    drop(game_state);
    let user_id = payload.player_slot.to_string();
}