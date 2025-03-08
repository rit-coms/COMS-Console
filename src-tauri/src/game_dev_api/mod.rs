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
use handlers::{get_leaderboard, get_save_data, set_leaderboard, set_save_data};
use serde::Deserialize;
use serde_with::{serde_as, NoneAsEmptyString};
use std::option::Option;

const VERSION: u8 = 1;

mod handlers;

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
