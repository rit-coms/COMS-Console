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
    // TODO: provide query params so we can return a specific save file or a list of all for one user, etc.
    // TODO: parse BSON from database bask into json
    let json_response = serde_json::json!([
        {
            "file_name":"2_24_2025",
            "data": {
                "money":32,
                "level":3,
            }
        }
    ]);

    Json(json_response)
}

fn app() -> Router {
    let route_prefix: String = format!("/api/v{}", VERSION.to_string());
    Router::new()
        .route(
            &format!("{}/leaderboard", route_prefix),
            post(set_leaderboard).get(get_leaderboard),
        )
        .route(
            &format!("{}/save-data", route_prefix),
            post(set_save_data).get(get_save_data),
        )
}

pub async fn setup_game_dev_api() {
    let app = app();

    println!("Server started successfully!!!");
    let listener = tokio::net::TcpListener::bind("127.0.0.1:8000")
        .await
        .unwrap(); // TODO make the port configurable
    axum::serve(listener, app).await.unwrap();
}

#[cfg(test)]
mod tests {
    use std::str;

    use super::*;
    use axum::http::Request;
    use axum::response::Response;
    use axum::{body::Body, http::StatusCode};
    use http_body_util::BodyExt;
    use tower::{Service, ServiceExt};

    async fn response_to_body_text(response: Response<Body>) -> String {
        String::from_utf8(
            response
                .into_body()
                .collect()
                .await
                .unwrap()
                .to_bytes()
                .to_ascii_lowercase(),
        ).unwrap()
    }

    #[tokio::test]
    async fn get_save_data() {
        let app = app();

        let response = app
            .oneshot(
                Request::builder()
                    .uri(format!("/api/v{}/save-data", VERSION))
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);

        let body_text: String = response_to_body_text(response).await;

        let response_fields: Vec<String> = vec![String::from("file_name"), String::from("data")];

        for field in response_fields {
            assert!(body_text.contains(&field));
        }
    }
}
