use std::sync::mpsc::Receiver;

use axum::{routing::post, Router};
use handlers::{get_leaderboard, get_save_data, set_leaderboard, set_save_data, ApiState};

const VERSION: u8 = 1;

pub mod handlers;
use crate::gamepad_manager::gamepad_manager::FrontendPlayerSlotConnection;

/// Creates an Axum router with leaderboard and save-data post and get handlers.
///
/// # Arguments
///
/// * `db_name` - A reference to the name of the database file. If this router isn't
/// for testing, make sure this matches the name of the .db file in the DATABASE_URL
/// envirenment variable
///
/// # Returns
///
/// * `Router` - An axum router with the route handlers stated above.
///
/// # Example
///
/// ```rust
/// use app::game_dev_api::create_router;
///
/// async fn setup_api() {
///     let app = create_router("local");
///
///     let listener = tokio::net::TcpListener::bind("127.0.0.1:8000")
///         .await
///         .unwrap();
///     
///     axum::serve(listener, app).await.unwrap();
/// }
/// ```
pub fn create_router(
    db_name: &str,
    controller_slot_rx: Receiver<Vec<FrontendPlayerSlotConnection>>,
) -> Router {
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

/// This function should be called in tauri builder to setup the http API for game
/// developers to read and write game data.
pub async fn setup_game_dev_api(
    db_name: &str,
    controller_slot_rx: Receiver<Vec<FrontendPlayerSlotConnection>>,
) {
    let app = create_router(db_name, controller_slot_rx);

    println!("Server started successfully!!!");
    let listener = tokio::net::TcpListener::bind("127.0.0.1:8000")
        .await
        .unwrap(); // TODO make the port configurable
    axum::serve(listener, app).await.unwrap();
}
