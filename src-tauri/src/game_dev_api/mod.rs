use crate::db::{
    self, establish_connection, 
    schema::{leaderboard::value_num, saves::file_name},
};
use axum::{
    extract::Query, http::StatusCode, response::IntoResponse, routing::{get, post}, serve::Listener, Json, Router
};
use diesel::{dsl::count, SqliteConnection};
use handlers::{get_leaderboard, get_save_data, set_leaderboard, set_save_data, ApiState};
use serde::Deserialize;
use serde_with::{serde_as, NoneAsEmptyString};
use std::option::Option;

const VERSION: u8 = 1;

mod handlers;


fn create_router(db_url: &str) -> Router {
    let route_prefix: String = format!("/api/v{}", VERSION.to_string());
    let api_state = ApiState {
        db_url: db_url.to_owned(),
    };

    Router::new()
        .route(
            &format!("{}/leaderboard", route_prefix),
            post(set_leaderboard).get(get_leaderboard),
        )
        .with_state(api_state.clone())// TODO: wrap the state in an ARC to avoid cloning???
        .route(
            &format!("{}/save-data", route_prefix),
            post(set_save_data).get(get_save_data),
        ).with_state(api_state)
}

pub async fn setup_game_dev_api(db_name: &str) {
    let app = create_router(db_name);

    println!("Server started successfully!!!");
    let listener = tokio::net::TcpListener::bind("127.0.0.1:8000")
        .await
        .unwrap(); // TODO make the port configurable
    axum::serve(listener, app).await.unwrap();
}
