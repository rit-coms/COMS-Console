use axum::{routing::post, Router};
use handlers::{get_leaderboard, get_save_data, set_leaderboard, set_save_data, ApiState, AppState, GameStateShared};
use tokio::sync::watch::Receiver;

const VERSION: u8 = 1;

pub mod handlers;

// #[tracing::instrument]
async fn handle_game_state_updates(game_state_update: GameStateShared, game_channel: Receiver<Option<u64>>) {
    println!("Started listener to watch in the router");
    let current_game = game_state_update;
    let mut watch = game_channel;
    let mut i = 0;
    loop {
        let mut game_id = current_game.write().await;
        println!("game_id {:?}: {:?}", i, game_id.id);
        game_id.id = *watch.borrow_and_update();
        drop(game_id);
        if watch.changed().await.is_err() {
            // the watch channel transmitter should never
            // be destroyed before the application closes
            unreachable!("Watch channel should not be destroyed while still listening.");
        }
        // Not entirely certain why the below fixes everything, but I guess it does?
        let mut game_id = current_game.write().await;
        game_id.id = *watch.borrow();
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
pub fn create_router(db_name: &str, game_channel: Receiver<Option<u64>>) -> Router {
    let route_prefix: String = format!("/api/v{}", VERSION.to_string());
    let api_state = ApiState {
        db_name: db_name.to_owned(),
    };
    let game_state = GameStateShared::default();

    // TODO: turn into another function
    tokio::spawn(handle_game_state_updates(game_state.clone(), game_channel));

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
pub async fn setup_game_dev_api(db_name: &str, game_channel: Receiver<Option<u64>>) {
    let app = create_router(db_name, game_channel);

    println!("Server started successfully!!!");
    let listener = tokio::net::TcpListener::bind("127.0.0.1:8000")
        .await
        .unwrap(); // TODO make the port configurable
    axum::serve(listener, app).await.unwrap();
}

#[cfg(test)]
mod test {
    use super::*;
    use tokio::{runtime::Runtime, sync::watch::{self, channel}};

    #[tokio::test]
    async fn game_state_change() {
        let game_id: u64 = 512039487;
        let db_name = "test_db";

        let (tx, mut rx) = watch::channel(Some(game_id));
        let router = create_router(db_name, rx.clone());

        let game_state = GameStateShared::default();
        let game_state_update = game_state.clone();
        let rx_copy = rx.clone();

        let handle = tokio::spawn(async move {
            println!("Started listener to watch in the router");
            let current_game = game_state_update;
            let mut watch = rx_copy;
            let mut game_id = current_game.write().await;
            // println!("game_id: {:?}", game_id.id);
            game_id.id = *watch.borrow_and_update();
            drop(game_id);
        });

        handle.await.expect("why tho");

        assert_eq!(game_state.read().await.id.unwrap(), 512039487);
        assert_eq!(rx.borrow_and_update().unwrap(), game_state.read().await.id.unwrap());


        tx.send(Some(0)).expect("Was unable to send to watch channel");
        let game_state_update = game_state.clone();
        let rx_copy = rx.clone();
        let handle = tokio::spawn(async move {
            println!("Started listener to watch in the router");
            let current_game = game_state_update;
            let mut watch = rx_copy;
            let mut game_id = current_game.write().await;
            // println!("game_id: {:?}", game_id.id);
            game_id.id = *watch.borrow_and_update();
            drop(game_id);
        });

        handle.await.expect("help");

        println!("{:?}", game_state.read().await.id);

        assert_eq!(game_state.read().await.id.unwrap(), 0);
        assert_eq!(rx.borrow_and_update().unwrap(), game_state.read().await.id.unwrap());
    }
}