use axum::{
    routing::post,
    Router,
};
use handlers::{get_leaderboard, get_save_data, set_leaderboard, set_save_data, ApiState};

const VERSION: u8 = 1;

pub mod handlers;

pub fn create_router(db_name: &str) -> Router {
    let route_prefix: String = format!("/api/v{}", VERSION.to_string());
    let api_state = ApiState {
        db_name: db_name.to_owned(),
    };

    Router::new()
        .route(
            &format!("{}/leaderboard", route_prefix),
            post(set_leaderboard).get(get_leaderboard),
        )
        .with_state(api_state.clone()) // TODO: wrap the state in an ARC to avoid cloning???
        .route(
            &format!("{}/save-data", route_prefix),
            post(set_save_data).get(get_save_data),
        )
        .with_state(api_state)
}

pub async fn setup_game_dev_api(db_name: &str) {
    let app = create_router(db_name);

    println!("Server started successfully!!!");
    let listener = tokio::net::TcpListener::bind("127.0.0.1:8000")
        .await
        .unwrap(); // TODO make the port configurable
    axum::serve(listener, app).await.unwrap();
}
