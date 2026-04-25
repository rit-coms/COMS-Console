use std::{fs::remove_file, sync::Arc};

use crate::{
    db::establish_connection,
    game_dev_api::{
        create_router,
        handlers::{GameState, GameStateShared, LeaderboardEntryPostPayload},
    },
};
use axum::Router;
use axum_test::TestServer;
use chrono::{DateTime, Utc};
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
use tempfile::NamedTempFile;
use tokio::sync::{
    watch::{self, Receiver, Sender},
    Notify, RwLock,
};

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
///     create_user(user_id_s, name_s, &test_context.db_path).await;
///
///     let result = get_user(name_s, user_id_s, &test_context.db_path).await;
///
///     assert_eq!(user_id_s, result.id.as_str());
///     assert_eq!(name_s, result.name.as_str());
/// }
/// ```
pub struct TestContext {
    pub db_file: NamedTempFile,
    pub current_game_tx: Sender<Option<u64>>,
    pub notifier: Arc<Notify>,
    pub server: TestServer,
}

impl TestContext {
    pub async fn new(db_name: &str) -> Self {
        let db_file = tempfile::Builder::new()
            .prefix(db_name)
            .suffix(".db")
            .tempfile()
            .expect(&format!("Failed to create temp file for {db_name}"));

        let db_path = db_file.path().as_os_str().to_str().unwrap();
        let mut connection = establish_connection(&db_path);
        println!("{db_path}");

        connection
            .run_pending_migrations(MIGRATIONS)
            .expect("Failed to run migrations");

        let (current_game_tx, current_game_rx) = watch::channel(None);
        let notifier = Arc::new(Notify::new());

        let app = setup_test_server(&db_path, current_game_rx, Arc::clone(&notifier)).await;

        Self {
            db_file,
            current_game_tx,
            notifier,
            server: TestServer::new(app).expect("Failed to set up test server"),
        }
    }

    pub fn get_db_path(&self) -> &str {
        return self.db_file.path().as_os_str().to_str().unwrap();
    }
}

pub async fn setup_initial_user_data(db_path: &str) {
    let users = vec![
        User {
            user_id: 1,
            username: "User 1".into(),
            about_me: None,
            profile_pic: None,
            crumbs: 67,
        },
        User {
            user_id: 2,
            username: "User 2".into(),
            about_me: Some("Yeah".into()),
            profile_pic: None,
            crumbs: 2,
        },
    ];

    users.iter().map(|user| create_user(user, db_path));
}

pub fn setup_initial_game_data(db_path: &str, date_time: DateTime<Utc>) {
    let games = vec![
        Game {
            game_id: 1,
            title: "Good Game".into(),
            author: "Me".into(),
            summary: "Just a good game".into(),
            release_date: date_time,
            cover_image: vec![0, 1, 2],
            multiplayer_id: 1,
        },
        Game {
            game_id: 2,
            title: "Better Game".into(),
            author: "You".into(),
            summary: "Just a better game".into(),
            release_date: date_time,
            cover_image: vec![0, 1, 2, 3],
            multiplayer_id: 2,
        },
    ];

    games.iter().for_each(|game| {
        insert_game(game, db_path);
    });
}

pub fn setup_initial_leaderboard_data(db_path: &str, date_time: DateTime<Utc>) {
    let leaderboard_entries = vec![
        LeaderboardEntryPostPayload {
            user_id: 1,
            game_id: 1,
            value_name: "Score".to_string(),
            value_num: 100.0,
        },
        LeaderboardEntryPostPayload {
            user_id: 2,
            game_id: 2,
            value_name: "High Score".to_string(),
            value_num: 250.0,
        },
    ];

    leaderboard_entries.iter().for_each(|entry| {
        insert_leaderboard_entry(entry, db_path);
    });
}

pub async fn setup_initial_data(db_path: &str, date_time: DateTime<Utc>) {
    setup_initial_game_data(db_path, date_time);
    setup_initial_user_data(db_path).await;
    setup_initial_leaderboard_data(db_path, date_time);
    println!("Setup initial data!")
}

async fn setup_test_server(
    db_path: &str,
    current_game_rx: Receiver<Option<u64>>,
    notifier: Arc<Notify>,
) -> Router {
    let game_state_shared: GameStateShared = Arc::new(GameState {
        id: Arc::new(RwLock::new(None)),
        notifier,
        channel: current_game_rx,
    });

    return create_router(db_path, game_state_shared).await;
}
