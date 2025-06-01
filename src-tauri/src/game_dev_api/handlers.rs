use crate::db::{self};
use crate::gamepad_manager::gamepad_manager::FrontendPlayerSlotConnection;
use axum::body::Bytes;
use axum::extract::ws::{Message, WebSocket};
use axum::extract::{ConnectInfo, WebSocketUpgrade};
use axum::{
    extract::{Query, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use axum_macros::FromRef;
use futures_util::{SinkExt, StreamExt};
use serde::{Deserialize, Serialize};
use serde_json::{from_str, json, Value};
use std::ops::ControlFlow;
use std::sync::Arc;
use std::{option::Option, path::PathBuf};
use tokio::{
    sync::watch,
    sync::broadcast,
    sync::{Notify, RwLock},
};

// TODO: rename to not be confused with the managed tauri app state
#[derive(Clone, FromRef)]
pub struct AppState {
    pub api_state: ApiState,
    pub game_state: GameStateShared,
}

#[derive(Clone, FromRef)]
pub struct ApiState {
    pub database_path: String,
    pub player_slot_rx: Arc<broadcast::Receiver<Vec<FrontendPlayerSlotConnection>>>,
}

#[derive(Debug, Clone)]
pub struct GameState {
    pub id: Arc<RwLock<Option<u64>>>,
    pub notifier: Arc<Notify>,
    pub channel: watch::Receiver<Option<u64>>,
}

pub type GameStateShared = Arc<GameState>;

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
    // TODO: Get game_id and user_id
    println!("Setting Laaderboard data");
    // let game_id = "1";
    let game_id = game_state.id.read().await.unwrap().to_string();
    drop(game_state);
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
    // let game_id = "0";x
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
    State(game_state): State<GameStateShared>,
    params: Query<SaveDataGetParams>,
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

pub async fn player_slots_socket_handler(
    ws: WebSocketUpgrade,
    State(state): State<ApiState>,
) -> impl IntoResponse {
    println!("Upgrading websocket!");
    ws.on_upgrade(move |socket| handle_player_slots_socket(socket, state))
}

async fn handle_player_slots_socket(mut socket: WebSocket, state: ApiState) {
    // send a ping (unsupported by some browsers) just to kick things off and get a response
    if socket
        .send(Message::Ping(Bytes::from_static(&[1, 2, 3])))
        .await
        .is_ok()
    {
        println!("Pinged client...");
    } else {
        println!("Could not send ping client!");
        // no Error here since the only thing we can do is to close the connection.
        // If we can not send messages, there is no way to salvage the statemachine anyway.
        return;
    }

    // receive single message from a client (we can either receive or send with socket).
    // this will likely be the Pong for our Ping or a hello message from client.
    // waiting for message from a client will block this task, but will not block other client's
    // connections.
    if let Some(msg) = socket.recv().await {
        if let Ok(msg) = msg {
            if process_message(msg).is_break() {
                return;
            }
        } else {
            println!("client abruptly disconnected");
            return;
        }
    }

    let (mut sender, mut reciever) = socket.split();

    let mut send_task = tokio::spawn(async move {
        let mut player_slot_receiver = Arc::clone(&state.player_slot_rx).resubscribe();
        while let Ok(msg) = player_slot_receiver.recv().await {
            sender
                .send(Message::Text(json!(msg).to_string().into()))
                .await
                .unwrap();
        }
    });

    let mut recv_task = tokio::spawn(async move {
        while let Some(Ok(msg)) = reciever.next().await {
            if process_message(msg).is_break() {
                break;
            }
        }
    });

    // If any one of the tasks exit, abort the other.
    tokio::select! {
        _ = (&mut send_task) => {
            recv_task.abort();
        },
        _ = (&mut recv_task) => {
            send_task.abort();
        }
    }

    // returning from the handler closes the websocket connection
    println!("Websocket context destroyed");
}

fn process_message(msg: Message) -> ControlFlow<(), ()> {
    match msg {
        Message::Text(text) => {
            println!("got str: {text}");
        }
        Message::Binary(items) => {
            println!("got {} bytes: {:?}", items.len(), items);
        }
        Message::Ping(items) => {
            println!("got ping with {items:?}");
        }
        Message::Pong(items) => {
            println!("got pong with {items:?}");
        }
        Message::Close(close_frame) => {
            if let Some(cf) = close_frame {
                println!("got close with code {} with reason {}", cf.code, cf.reason);
            } else {
                println!("got close message without close frame");
            }
            return ControlFlow::Break(());
        }
    }
    ControlFlow::Continue(())
}
