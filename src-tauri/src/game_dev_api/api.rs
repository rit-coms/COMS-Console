use axum::{
    extract::Query,
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use serde::Deserialize;

const VERSION: u8 = 1;

#[derive(Deserialize)]
struct LeaderboardEntry {
    tag: String,
    value: u32,
}

#[derive(Deserialize)]
struct SaveDataEntry {
    file_name: String,
    data: serde_json::Value, // This data should be stored in the database as BSON data, is this the correct type?
}

#[derive(Deserialize)]
enum LeaderboardScope {
    User,
    Global,
}

#[derive(Deserialize)]
struct LeaderboardGetParams {
    scope: LeaderboardScope,
}

async fn set_leaderboard(Json(payload): Json<LeaderboardEntry>) {
    // Get game_id and user_id
    let game_id = 42;
    let user_id = 0;

    // Save entry to database
    println!(
        "Saved to database: {{user_id:{user_id:?}, game_id:{game_id:?}, tag:{0:?}, value:{1:?}}}",
        payload.tag, payload.value
    )
}

async fn get_leaderboard(params: Query<LeaderboardGetParams>) -> impl IntoResponse {
    let json_response: serde_json::Value;
    match params.scope {
        // TODO: query databse
        // TODO: should we exclude game and user id from response since we are handling that instead of the game developer?
        LeaderboardScope::User => {
            // Example data with two leaderboard entries
            json_response = serde_json::json!([
                {
                    "user_id":3,
                    "game_id":6,
                    "name":"points",
                    "value":312
                },
                {
                    "user_id":3,
                    "game_id":6,
                    "name":"points",
                    "value":365
                }
            ]);
            Json(json_response)
        }
        LeaderboardScope::Global => {
            json_response = serde_json::json!([
                {
                    "user_id":5,
                    "game_id":6,
                    "name":"points",
                    "value":312
                },
                {
                    "user_id":7,
                    "game_id":6,
                    "name":"points",
                    "value":365
                }
            ]);
            Json(json_response)
        }
    }
}

async fn set_save_data(Json(payload): Json<SaveDataEntry>) {
    let game_id = 32;
    let user_id = 53;
    let bson_data = bson::to_bson(&payload.data);

    // Save entry to database;
    println!(
        "Saved to database: {{user_id:{user_id:?}, game_id:{game_id:?}, file_id{:?}}} with also some BSON data",
        payload.file_name
    )
}

async fn get_save_data() -> impl IntoResponse {
    // TODO: parse BSON from database bask into json
    let data: String = String::from(r#"{"money":32, "level":3}"#);
    let json_response = serde_json::json!([
        {
            "file_name":"2_24_2025",
            "data": data
        }
    ]);

    Json(json_response)
}

async fn get_all_save_paths() -> impl IntoResponse {}

pub async fn setup_game_dev_api() {
    let route_prefix: String = format!("/api/v{}", VERSION.to_string());
    let app = Router::new()
        .route(
            &format!("{}/leaderboard", route_prefix),
            post(set_leaderboard).get(get_leaderboard),
        )
        .route(
            &format!("{}/save-data", route_prefixt ),
            post(set_save_data).get(get_save_data),
        );

    println!("Server started successfully!!!");
    let listener = tokio::net::TcpListener::bind("127.0.0.1:8000")
        .await
        .unwrap(); // TODO make the port configurable
    axum::serve(listener, app).await.unwrap();
    println!("API routes accessible at {:?}", route_prefix)
}
