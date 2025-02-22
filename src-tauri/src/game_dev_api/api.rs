use axum::{response::IntoResponse, routing::{get, post}, Json, Router};
use serde::Deserialize;

#[derive(Deserialize)]
struct LeaderboardEntry {
    tag: String,
    value: u32,
}

/// Example get request handler
async fn hello_world_handler() -> impl IntoResponse {
    let json_response = serde_json::json!({
        "message":"Hello world!"
    });

    Json(json_response)
}

async fn set_leaderboard(Json(payload): Json<LeaderboardEntry>) {
    // Get game_id and user_id
    let game_id = 42;
    let user_id = 0;

    // Save entry to database
    println!("Saved to database: {{user_id:{user_id:?}, gameid:{game_id:?}, tag:{0:?}, value:{1:?}}}", payload.tag, payload.value)
}

async fn get_leaderboard() -> impl IntoResponse {}

async fn set_save_data() {}

async fn get_save_data() -> impl IntoResponse {}

async fn get_all_save_paths() -> impl IntoResponse {}

pub async fn setup_game_dev_api() {
    let app = Router::new()
    .route("/api/healthchecker", get(hello_world_handler))
    .route("/api/set-leaderboard", post(set_leaderboard));

    println!("Server started successfully!!!");
    let listener = tokio::net::TcpListener::bind("127.0.0.1:8000")
        .await
        .unwrap(); // TODO make the port configurable
    axum::serve(listener, app).await.unwrap();
}
