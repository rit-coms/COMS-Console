use std::sync::Arc;

use axum::{routing::post, Router};
use axum_macros::FromRef;
use tokio::sync::{watch::Receiver, Notify, RwLock};

pub mod v1_handlers;
pub mod v2_handlers;

// TODO: rename to not be confused with the managed tauri app state
#[derive(Clone, FromRef)]
pub struct AppState {
    pub api_state: ApiState,
    pub game_state: GameStateShared,
}

#[derive(Clone)]
pub struct ApiState {
    pub database_path: String,
}

#[derive(Debug, Clone)]
pub struct GameState {
    pub id: Arc<RwLock<Option<u64>>>, // The current game ID, if any
    pub notifier: Arc<Notify>,
    pub channel: Receiver<Option<u64>>,
}

pub type GameStateShared = Arc<GameState>;

/// Listens to and updates the current shared game state
/// by synchronizing the current game ID with the latest from a watch channel
async fn handle_game_state_updates(game_state: GameStateShared) {
    println!("Started listener to watch in the router");
    let current_game = game_state.id.clone();
    let mut watch = game_state.channel.clone();
    let mut i = 0;
    // let mut game_id = current_game.write().await;
    // *game_id = None;
    // println!("Set inital game_id to None");
    // drop(game_id);
    loop {
        let mut game_id = current_game.write().await;
        *game_id = *watch.borrow_and_update();
        println!("set game_id {:?}: {:?}", i, game_id);
        drop(game_id);
        game_state.notifier.notify_one();
        println!("Sent notification");
        if watch.changed().await.is_err() {
            // the watch channel transmitter should never
            // be destroyed before the application closes
            unreachable!("Watch channel should not be destroyed while still listening.");
        }
        // // Not entirely certain why the below fixes everything, but I guess it does?
        // let mut game_id = current_game.write().await;
        // println!("game_id {:?} after await: {:?}", i, game_id);
        // *game_id = *watch.borrow();
        // drop(game_id);
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
/// use quackbox_backend::game_dev_api::create_router;
/// use quackbox_backend::game_dev_api::GameState;
/// use std::sync::Arc;
/// use tokio::sync::{Mutex, RwLock, watch, Notify};
///
/// async fn setup_api() {
///     let game_id = Some(0);
///     let (tx, rx) = watch::channel(game_id);
///     let app = create_router("local", Arc::new(GameState {
///         id: Arc::new(RwLock::new(game_id)),
///         notifier: Arc::new(Notify::new()),
///         channel: rx
///     })).await;
///
///     let listener = tokio::net::TcpListener::bind("127.0.0.1:8000")
///         .await
///         .unwrap();
///     
///     axum::serve(listener, app).await.unwrap();
/// }
/// ```
pub async fn create_router(db_path: &str, game_state: GameStateShared) -> Router {
    let api_state = ApiState {
        database_path: db_path.to_owned(),
    };
    let game_state = game_state;

    tokio::spawn(handle_game_state_updates(game_state.clone()));
    game_state.notifier.notified().await; // wait for the first notification
    println!("Received first notification");

    let app_state = AppState {
        api_state,
        game_state,
    };

    Router::new()
        .route(
            "/api/v1/leaderboard",
            post(v1_handlers::set_leaderboard).get(v1_handlers::get_leaderboard),
        )
        .route(
            "/api/v1/save-data",
            post(v1_handlers::set_save_data).get(v1_handlers::get_save_data),
        )
        .route(
            "/api/v2/save-data/player_slots/{player_slot}",
            post(v2_handlers::upsert_save_data).get(v2_handlers::get_save_data)
        )
        .with_state(app_state)
}

/// This function should be called in tauri builder to setup the http API for game
/// developers to read and write game data.
pub async fn setup_game_dev_api(db_path: String, game_state: GameStateShared) {
    let app = create_router(&db_path, game_state).await;

    println!("Server started successfully!!!");
    let listener = tokio::net::TcpListener::bind("127.0.0.1:6174")
        .await
        .unwrap(); // TODO make the port configurable
    axum::serve(listener, app).await.unwrap();
}

#[cfg(test)]
mod test {
    use std::sync::Arc;

    use crate::game_dev_api::GameState;

    use super::*;
    use tokio::sync::{watch, Notify, RwLock};

    #[tokio::test]
    async fn game_state_change() {
        let db_name = "game_state_change";

        let (tx, rx) = watch::channel(None);
        let notify = Arc::new(Notify::new());
        let game_state_shared: GameStateShared = Arc::new(GameState {
            id: Arc::new(RwLock::new(None)),
            notifier: Arc::clone(&notify),
            channel: rx.clone(),
        });
        let _router = create_router(db_name, Arc::clone(&game_state_shared)).await;

        let game_id: Option<u64> = Some(512039487);

        tx.send(game_id)
            .expect("Was unable to send to watch channel");
        println!("Sent game_id: {:?}", game_id);

        notify.notified().await;
        println!("Received notification: {:?}", game_id);

        assert_eq!(*game_state_shared.id.read().await, game_id);
        assert_eq!(*rx.borrow(), *game_state_shared.id.read().await);

        let game_id: Option<u64> = Some(0);

        tx.send(game_id)
            .expect("Was unable to send to watch channel");
        println!("Sent game_id: {:?}", game_id);

        notify.notified().await;
        println!("Received notification: {:?}", game_id);

        assert_eq!(*game_state_shared.id.read().await, game_id);
        assert_eq!(*rx.borrow(), game_id);
    }
}
