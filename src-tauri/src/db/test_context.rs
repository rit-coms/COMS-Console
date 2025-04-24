use std::{fs::remove_file, sync::Arc};

use crate::{db::{establish_connection, get_db_path}, game_dev_api::{create_router, handlers::{GameState, GameStateShared}}};
use axum::Router;
use axum_test::TestServer;
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
use dotenvy::dotenv;
use tokio::sync::{watch::{self, Receiver, Sender}, Notify, RwLock};

use super::{
    create_user, insert_game, insert_leaderboard_entry,
    models::{Game, LeaderboardEntry, User},
};

const MIGRATIONS: EmbeddedMigrations = embed_migrations!("migrations/");

/// This struct is to be used for setting up and automatically deleting database instances for testing.
/// * When this struct is created with new(), a temporary sqlite database is setup in the path designated
/// by the DATABASE_URL environment variable.
/// * When this struct falls out of scope, the temporary database file is automatically deleted.
/// # Usage
/// ```rust
/// #[test]
/// fn test_db() {
///     let test_context = TestContext::new("read_and_write_user_table_db");
///
///     // create test user
///     let user_id_s = "1141245215512";
///     let name_s = "A random user";
///
///     create_user(user_id_s, name_s, &test_context.db_name).await;
///
///     let result = get_user(name_s, user_id_s, &test_context.db_name).await;
///
///     assert_eq!(user_id_s, result.id.as_str());
///     assert_eq!(name_s, result.name.as_str());
/// }
/// ```
pub struct TestContext {
    pub db_name: String,
    pub current_game_tx: Sender<Option<u64>>,
    pub notifier: Arc<Notify>,
    pub server: TestServer
}

impl TestContext {
    pub fn new(db_name: &str) -> Self {
        dotenv().expect("Make sure you have a .env in the project root directory");
        let mut connection = establish_connection(db_name);

        connection
            .run_pending_migrations(MIGRATIONS)
            .expect("Failed to run migrations");

        let (current_game_tx, current_game_rx) = watch::channel(None);
        let notifier = Arc::new(Notify::new());

        let app = setup_test_server(db_name, current_game_rx, Arc::clone(&notifier));

        Self {
            db_name: db_name.to_owned(),
            current_game_tx,
            notifier,
            server: TestServer::new(app).expect("Failed to set up test server")
        }
    }
}

impl Drop for TestContext {
    fn drop(&mut self) {
        remove_file(get_db_path(&self.db_name)).expect("Failed to delete file");
    }
}

pub async fn setup_initial_user_data(db_name: &str) {
    let users = vec![
        User {
            id: String::from("1"),
            name: String::from("user1"),
            rit_id: None,
        },
        User {
            id: String::from("2"),
            name: String::from("user2"),
            rit_id: None,
        },
    ];

    for user in users {
        create_user(&user.id, &user.name, db_name);
    }
}

pub fn setup_initial_game_data(db_name: &str) {
    let games = vec![
        Game {
            id: String::from("1"),
            name: String::from("game1"),
            installed: true,
        },
        Game {
            id: String::from("0"),
            name: String::from("game0"),
            installed: true,
        },
    ];

    for game in games {
        insert_game(&game.id, &game.name, game.installed, db_name);
    }
}

pub fn setup_initial_leaderboard_data(db_name: &str) {
    let entries = vec![
        LeaderboardEntry {
            user_id: "1".to_string(),
            game_id: "0".to_string(),
            value_name: "Score".to_string(),
            time_stamp: "timestamp".to_string(),
            value_num: 100.0,
            row_id: 0, // placeholder
        },
        LeaderboardEntry {
            user_id: "2".to_string(),
            game_id: "0".to_string(),
            value_name: "Score".to_string(),
            time_stamp: "timestamp".to_string(),
            value_num: 125.0,
            row_id: 0, // placeholder
        },
        LeaderboardEntry {
            user_id: "1".to_string(),
            game_id: "0".to_string(),
            value_name: "Money".to_string(),
            time_stamp: "timestamp".to_string(),
            value_num: 423.50,
            row_id: 0, // placeholder
        },
    ];

    for entry in entries {
        insert_leaderboard_entry(
            &entry.user_id,
            &entry.game_id,
            &entry.value_name,
            entry.value_num,
            db_name,
        ).expect("Failed to insert leaderboard entry");
    }
}

pub async fn setup_initial_data(db_name: &str) {
    setup_initial_game_data(db_name);
    setup_initial_user_data(db_name).await;
    setup_initial_leaderboard_data(db_name);
    println!("Setup initial data!")
}

fn setup_test_server(db_name: &str, current_game_rx: Receiver<Option<u64>>, notifier: Arc<Notify>) -> Router {
    let game_state_shared: GameStateShared = Arc::new(GameState {
        id: Arc::new(RwLock::new(None)),
        notifier,
        channel: current_game_rx,
    });

    return create_router(db_name, game_state_shared)
}
