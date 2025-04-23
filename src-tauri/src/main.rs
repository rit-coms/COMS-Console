// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use frontend_api::{get_game_info, get_leaderboard_data, play_game, AppState, GameSenderState};
use game_dev_api::setup_game_dev_api;
use tauri::{api::path::local_data_dir, Manager};
use tauri_plugin_autostart::{MacosLauncher, ManagerExt};
use tokio::sync::watch;

use std::sync::Mutex;

mod frontend_api;
mod game_dev_api;
mod db;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec![""]),
        ))
        .setup(|app| {
            app.manage(Mutex::new(AppState::default()));
            // tauri::async_runtime::spawn(db::test_db());
            
            let (current_game_tx, current_game_rx) = watch::channel(None);
            app.manage(GameSenderState { game_watch_tx: current_game_tx });

            tauri::async_runtime::spawn(setup_game_dev_api("local", current_game_rx));
            if cfg!(feature = "autostart") {
                // Only enable autolaunch on raspberry pi
                app.autolaunch().enable()?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_game_info, play_game, get_leaderboard_data])
        .on_page_load(|window, _| {
            window.show().expect("Failed to show window");
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
