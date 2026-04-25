// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use db::setup_db;
use frontend_api::{get_game_info, get_leaderboard_data, play_game, AppState, GameSenderState};
use game_dev_api::handlers::GameState;
use game_dev_api::handlers::GameStateShared;
use game_dev_api::setup_game_dev_api;
use quackbox_backend::db::create_guest_user;
use tauri::Manager;
use tauri_plugin_autostart::{MacosLauncher, ManagerExt};
use tokio::sync::watch;
use tokio::sync::Mutex;
use tokio::sync::Notify;
use tokio::sync::RwLock;

use std::sync::Arc;

use crate::db::insert_multiplayer;
use crate::db::models::Multiplayer;
use crate::frontend_api::check_all_games;

mod db;
mod frontend_api;
mod game_dev_api;

const DB_PATH: &str = "postgresql://postgres:password@localhost:5432/quackbox-db";

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_autostart::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec![""]),
        ))
        .setup(|app| {
            let db_path = DB_PATH.to_string();
            app.manage(Mutex::new(AppState::new(db_path.clone())));

            let (current_game_tx, current_game_rx) = watch::channel(None);
            let notify = Arc::new(Notify::new());
            app.manage(GameSenderState {
                game_watch_tx: current_game_tx,
                notifier: Arc::clone(&notify),
            });

            let game_state_shared: GameStateShared = Arc::new(GameState {
                id: Arc::new(RwLock::new(None)),
                notifier: Arc::clone(&notify),
                channel: current_game_rx.clone(),
            });

            let db_setup_notifier = Arc::new(Notify::new());
            tauri::async_runtime::spawn({
                let db_path = db_path.clone();
                setup_db(db_path.as_str());
                Arc::clone(&db_setup_notifier).notify_one();
                create_guest_user(db_path.as_str());
                setup_game_dev_api(db_path, game_state_shared)
            });

            let app_data_dir = app
                .handle()
                .path()
                .app_data_dir()
                .expect("Could not find app data directory");

            tauri::async_runtime::spawn(async move {
                // Waire for the db to be setup before inserting games
                db_setup_notifier.notified().await;
                println!("Checking all games!");
                let _ = insert_multiplayer(
                    &Multiplayer {
                        multiplayer_id: 0,
                        local_min: 1,
                        local_max: 1,
                        online_multiplayer: false,
                    },
                    &db_path,
                )
                .await;
                check_all_games(app_data_dir, &db_path).await;
            });

            if cfg!(feature = "autostart") {
                // Only enable autolaunch on raspberry pi
                app.autolaunch().enable()?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_game_info,
            play_game,
            get_leaderboard_data
        ])
        .on_page_load(|window, _| {
            window.show().expect("Failed to show window");
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
