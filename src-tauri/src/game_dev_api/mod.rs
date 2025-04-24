use std::sync::Arc;

use axum::{routing::post, Router};
use handlers::{get_leaderboard, get_save_data, set_leaderboard, set_save_data, ApiState, AppState, GameStateShared};
use tokio::sync::{watch::Receiver, Notify};

const VERSION: u8 = 1;

pub mod handlers;

// #[tracing::instrument]
async fn handle_game_state_updates(game_state: GameStateShared) {
    println!("Started listener to watch in the router");
    let current_game = game_state.id.clone();
    let mut watch = game_state.channel.clone();
    let mut i = 0;
    loop {
        let mut game_id = current_game.write().await;
        println!("game_id {:?}: {:?}", i, game_id);
        *game_id = *watch.borrow_and_update();
        drop(game_id);
        game_state.notifier.notify_one();
        if watch.changed().await.is_err() {
            // the watch channel transmitter should never
            // be destroyed before the application closes
            unreachable!("Watch channel should not be destroyed while still listening.");
        }
        // Not entirely certain why the below fixes everything, but I guess it does?
        let mut game_id = current_game.write().await;
        *game_id = *watch.borrow();
        drop(game_id);
        i += 1;
    }
}

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
pub fn create_router(db_name: &str, game_state: GameStateShared) -> Router {
    let route_prefix: String = format!("/api/v{}", VERSION.to_string());
    let api_state = ApiState {
        db_name: db_name.to_owned(),
    };
    let game_state = game_state;

    // TODO: turn into another function
    tokio::spawn(handle_game_state_updates(game_state.clone()));

    let app_state = AppState {
        api_state,
        game_state
    };

    Router::new()
        .route(
            &format!("{}/leaderboard", route_prefix),
            post(set_leaderboard).get(get_leaderboard),
        )
        // .with_state(app_state.clone()) // TODO: wrap the state in an ARC to avoid cloning???
        .route(
            &format!("{}/save-data", route_prefix),
            post(set_save_data).get(get_save_data),
        )
        .with_state(app_state)
}

/// This function should be called in tauri builder to setup the http API for game
/// developers to read and write game data.
pub async fn setup_game_dev_api(db_name: &str, game_state: GameStateShared) {
    let app = create_router(db_name, game_state);

    println!("Server started successfully!!!");
    let listener = tokio::net::TcpListener::bind("127.0.0.1:8000")
        .await
        .unwrap(); // TODO make the port configurable
    axum::serve(listener, app).await.unwrap();
}

#[cfg(test)]
mod test {
    use crate::game_dev_api::handlers::GameState;

    use super::*;
    use tokio::{runtime::Runtime, sync::{watch::{self, channel}, RwLock}};

    #[tokio::test]
    async fn game_state_change() {
        let game_id: Option<u64> = Some(512039487);
        let db_name = "test_db";

        let (tx, mut rx) = watch::channel(game_id);
        let notify = Arc::new(Notify::new());
        let game_state_shared: GameStateShared = Arc::new(GameState {
            id: Arc::new(RwLock::new(None)),
            notifier: Arc::clone(&notify),
            channel: rx.clone()
        });
        let router = create_router(db_name, Arc::clone(&game_state_shared));

        tokio::spawn(handle_game_state_updates(Arc::clone(&game_state_shared)));

        Arc::clone(&notify).notified().await;
        assert_eq!(*game_state_shared.id.read().await, game_id);
        assert_eq!(*rx.borrow_and_update(), *game_state_shared.id.read().await);

        let game_id: Option<u64> = Some(0);

        tx.send(game_id).expect("Was unable to send to watch channel");
        Arc::clone(&notify).notified().await;
        println!("{:?}", game_state_shared.id.read().await);

        assert_eq!(*game_state_shared.id.read().await, game_id);
        assert_eq!(*rx.borrow_and_update(), game_id);
    }
}