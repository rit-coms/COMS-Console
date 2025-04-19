use crate::db::{self};
use axum::body::Bytes;
use axum::extract::ws::{Message, WebSocket};
use axum::extract::{ConnectInfo, WebSocketUpgrade};
use axum::{
    extract::{Query, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde::{Deserialize, Serialize};
use serde_json::{from_str, Value};
use std::net::SocketAddr;
use std::option::Option;

#[derive(Clone)]
pub struct ApiState {
    pub db_name: String,
}

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
    Json(payload): Json<LeaderboardPost>,
) -> impl IntoResponse {
    // TODO: Get game_id and user_id
    println!("Setting Laaderboard data");
    let game_id = "1";
    let user_id = payload.player_slot.to_string();

    // Save entry to database
    // TODO: Can I return the query response from this function?
    db::insert_leaderboard_entry(
        &user_id,
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
    params: Query<LeaderboardGetParams>,
) -> impl IntoResponse {
    let game_id: String = String::from("1"); // Example for now
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
        &state.db_name,
    )
    .await;

    let mut json_response: Vec<serde_json::Value> = Vec::new();

    // TODO: add time_stamp
    for entry in leaderboard_entries {
        json_response.push(serde_json::json!({
            "value_name": entry.value_name,
            "value_num": entry.value_num,
            "player_slot": str::parse::<i16>(&entry.user_id).unwrap(),
        }));
    }

    Json(json_response).into_response()
}

// Handles save-data HTTP post requests for the axum webserver
pub async fn set_save_data(
    State(state): State<ApiState>,
    Json(payload): Json<SaveDataPost>,
) -> impl IntoResponse {
    let game_id = "0";
    let user_id = payload.player_slot.to_string();

    // Save entry to database;
    // TODO: more elegant error handling for converting json data to vec of bytes
    db::set_save(
        &user_id,
        game_id,
        payload.file_name.as_str(),
        &serde_json::to_vec(&payload.data).unwrap(),
        &state.db_name,
    )
    .await;

    Json(serde_json::json!({
        "file_name": payload.file_name,
        "data": payload.data,
        "player_slot": payload.player_slot,
    }))
}

#[derive(Deserialize, Serialize)]
pub struct SaveDataGetParams {
    pub file_name: Option<String>,
    pub regex: Option<String>,
    pub player_slot: Option<i16>,
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
    let user_id_s: Option<String> = match params.player_slot {
        Some(slot) => Some(slot.to_string()),
        None => None,
    };

    let save_data_entries = db::get_save_data(
        &Some(game_id),
        &user_id_s,
        &params.file_name,
        &params.regex,
        &state.db_name,
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
                        }));
            }
            return Json(json_response).into_response();
        }
        Err(e) => (StatusCode::BAD_REQUEST, e.to_string()).into_response(),
    }
}

pub async fn player_slots_socket_handler(
    ws: WebSocketUpgrade,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
) -> impl IntoResponse {
    ws.on_upgrade(move |socket| handle_player_slots_socket(socket, addr))
}

async fn handle_player_slots_socket(mut socket: WebSocket, who: SocketAddr) {
    // send a ping (unsupported by some browsers) just to kick things off and get a response
    if socket
        .send(Message::Ping(Bytes::from_static(&[1, 2, 3])))
        .await
        .is_ok()
    {
        println!("Pinged {who}...");
    } else {
        println!("Could not send ping {who}!");
        // no Error here since the only thing we can do is to close the connection.
        // If we can not send messages, there is no way to salvage the statemachine anyway.
        return;
    }
}
