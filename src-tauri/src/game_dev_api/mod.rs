use crate::db::{
    self,
    schema::{leaderboard::value_num, saves::file_name},
};
use axum::{
    extract::Query,
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use diesel::dsl::count;
use serde::Deserialize;
use serde_with::{serde_as, NoneAsEmptyString};
use std::option::Option;

const VERSION: u8 = 1;

#[derive(Deserialize)]
struct LeaderboardEntry {
    value_name: String,
    value_num: i64,
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

async fn set_leaderboard(Json(payload): Json<LeaderboardEntry>) -> impl IntoResponse {
    // Get game_id and user_id
    let game_id = "4234345";
    let user_id = "0234345";

    // Save entry to database
    db::insert_leaderboard_entry(
        user_id,
        game_id,
        payload.value_name.as_str(),
        payload.value_num,
    );

    Json(serde_json::json!({
        "value_name":payload.value_name,
        "value_num":payload.value_num,
    }))
}

#[derive(Deserialize)]
struct LeaderboardGetParams {
    scope: Option<LeaderboardScope>,
    count: Option<i64>,
    ascending: Option<bool>,
    value_name: Option<String>,
    offset: Option<i64>,
}

async fn get_leaderboard(params: Query<LeaderboardGetParams>) -> impl IntoResponse {
    let game_id: String = String::from("123124"); // Example for now
    let user_id: String = String::from("3451435");
    let count: Option<i64>;

    // TODO: add error http response to handle when count > 100
    if let Some(entry_count) = params.count {
        if entry_count > 100 {
            count = Some(100);
        } else {
            count = Some(entry_count);
        }
    } else {
        count = Some(100);
    }

    // Set the user_id according to the given leaderboard scope
    // TODO: get actual user_id
    let user_id_s: Option<String> = match &params.scope {
        Some(scope) => match scope {
            LeaderboardScope::User => Some(user_id),
            LeaderboardScope::Global => None,
        },
        None => None, // If no scope query param given, default to global
    };

    let leaderboard_entries = db::get_leaderboard(
        Some(game_id),
        user_id_s,
        count,
        params.ascending,
        params.value_name.clone(),
        params.offset,
    )
    .await;

    let mut json_response: Vec<serde_json::Value> = Vec::new();

    // TODO: add time_stamp
    for entry in leaderboard_entries {
        json_response.push(serde_json::json!({
            "value_name": entry.value_name,
            "value_num": entry.value_num,
        }));
    }

    Json(json_response)
}

async fn set_save_data(Json(payload): Json<SaveDataEntry>) -> impl IntoResponse {
    let game_id = 32;
    let user_id = 53;

    // Save entry to database;
    println!(
        "Saved to database: {{user_id:{user_id:?}, game_id:{game_id:?}, file_name{:?}}} with also some BSON data",
        payload.file_name
    );

    Json(serde_json::json!({
        "file_name": payload.file_name,
        "data": payload.data
    }))
}

#[derive(Deserialize)]
struct SaveDataGetParams {
    file_name: Option<String>,
    count: Option<i64>,
    offset: Option<i64>,
    ascending: Option<bool>,
}

/// Can either get a list of save files for current user or
/// get a specific file by user and name
async fn get_save_data(params: Query<SaveDataGetParams>) -> impl IntoResponse {
    let game_id: String = String::from("123124"); // Example for now
    let user_id: String = String::from("3451435");

    // File names should be unique per game, so if both file_name and count are
    // provided, the developer should know that they can't do that. One and only
    // one of these parameters should be provided.
    let file_name_s: Option<String>;
    let entry_count: Option<i64>;
    match (params.file_name.clone(), params.count) {
        (Some(_), Some(_)) => (return StatusCode::BAD_REQUEST.into_response()),
        (Some(filename), None) => {
            file_name_s = Some(filename);
            entry_count = None;
        }
        (None, Some(num_entries)) => {
            if num_entries > 50 {
                (return StatusCode::PAYLOAD_TOO_LARGE.into_response())
            }
            file_name_s = None;
            entry_count = Some(num_entries);
        }
        (None, None) => {
            file_name_s = None;
            entry_count = Some(10)
        }
    }

    let save_data_entries = db::get_save_data(
        Some(game_id),
        Some(user_id),
        entry_count,
        params.offset,
        params.ascending,
    )
    .await;

    let mut json_response = Vec::new();

    // TODO: add time_stamp
    // TODO: parse binary data into json
    for entry in save_data_entries {
        json_response.push(serde_json::json!({
            "data":entry.data,
            "file_name": entry.file_name
        }));
    }

    Json(json_response).into_response()
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

    async fn response_to_body_text(response: Response) -> String {
        String::from_utf8(
            response
                .into_body()
                .collect()
                .await
                .unwrap()
                .to_bytes()
                .to_ascii_lowercase(),
        )
        .unwrap()
    }

    #[tokio::test]
    async fn get_save_file() {
        let app = app();

        let response = app
            .oneshot(
                Request::builder()
                    .uri(format!("/api/v{}/save-data?file_name=test", VERSION))
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
