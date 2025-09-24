// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use db::setup_db;
use frontend_api::{get_game_info, get_leaderboard_data, play_game, AppState, GameSenderState};
use game_dev_api::handlers::GameState;
use game_dev_api::handlers::GameStateShared;
use game_dev_api::setup_game_dev_api;
use quackbox_backend::db::create_default_guest;
use tauri::Manager;
use tauri_plugin_autostart::{MacosLauncher, ManagerExt};
use tokio::sync::watch;
use tokio::sync::Mutex;
use tokio::sync::Notify;
use tokio::sync::RwLock;

use std::sync::Arc;

mod db;
mod frontend_api;
mod game_dev_api;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec![""]),
        ))
        .setup(|app| {
            let db_path = app
                .path()
                .app_data_dir()
                .unwrap()
                .join("local")
                .with_extension("db")
                .into_os_string()
                .into_string()
                .unwrap();
            app.manage(Mutex::new(AppState::new(db_path.clone())));
            // tauri::async_runtime::spawn(db::test_db());

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
            tauri::async_runtime::spawn({
                setup_db(db_path.as_str());
                create_default_guest(db_path.as_str());
                setup_game_dev_api(db_path, game_state_shared)
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
