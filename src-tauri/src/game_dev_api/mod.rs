use std::sync::Arc;

use axum::{
    routing::{any, post},
    Router,
};
use handlers::{
    get_leaderboard, get_save_data, player_slots_socket_handler, set_leaderboard, set_save_data,
    ApiState,
};
use tokio::sync::broadcast::Receiver;
use tower_http::trace::{DefaultMakeSpan, TraceLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

pub const VERSION: u8 = 1;

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
/// use std::sync::mpsc;
///
/// async fn setup_api() {
///     let (tx, rx) = mpsc::channel();
///     let app = create_router("local", rx);
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
        player_slot_rx: Arc::new(controller_slot_rx),
    };

    Router::new()
        .route(
            &format!("{}/leaderboard", route_prefix),
            post(set_leaderboard).get(get_leaderboard),
        )
        .route(
            &format!("{}/save-data", route_prefix),
            post(set_save_data).get(get_save_data),
        )
        .route(
            &format!("{}/player-slots-ws", route_prefix),
            any(player_slots_socket_handler),
        )
        .layer(
            TraceLayer::new_for_http()
                .make_span_with(DefaultMakeSpan::default().include_headers(true)),
        )
        .with_state(api_state)
}

/// This function should be called in tauri builder to setup the http API for game
/// developers to read and write game data.
pub async fn setup_game_dev_api(
    db_name: &str,
    controller_slot_rx: Receiver<Vec<FrontendPlayerSlotConnection>>,
) {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| {
                format!("{}=debug,tower_http=debug", env!("CARGO_CRATE_NAME")).into()
            }),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let app = create_router(db_name, controller_slot_rx);

    println!("Local webserver started successfully!!!");
    let listener = tokio::net::TcpListener::bind("127.0.0.1:8000")
        .await
        .unwrap(); // TODO make the port configurable
    axum::serve(listener, app).await.unwrap();
}
