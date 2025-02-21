use axum::{response::IntoResponse, routing::get, Json, Router};

/// Example get request handler
async fn hello_world_handler() -> impl IntoResponse {
    let json_response = serde_json::json!({
        "message":"Hello world!"
    });

    Json(json_response)
}

async fn set_leaderboard() {}

async fn get_leaderboard() -> impl IntoResponse {}

async fn set_save_data() {}

async fn get_save_data() -> impl IntoResponse {}

async fn get_all_save_paths() -> impl IntoResponse {}

pub async fn setup_game_dev_api() {
    let app = Router::new().route("/api/healthchecker", get(hello_world_handler));

    println!("Server started successfully!!!");
    let listener = tokio::net::TcpListener::bind("127.0.0.1:8000")
        .await
        .unwrap(); // TODO make the port configurable
    axum::serve(listener, app).await.unwrap();
}
