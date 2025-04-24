// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use frontend_api::{get_game_info, get_leaderboard_data, play_game, AppState};
use game_dev_api::setup_game_dev_api;
use tauri::{api::path::local_data_dir, Manager};
use tauri_plugin_autostart::{MacosLauncher, ManagerExt};

use std::sync::Mutex;

mod db;
mod frontend_api;
mod game_dev_api;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec![""]),
        ))
        .setup(|app| {
            app.manage(Mutex::new(AppState::default()));
            // tauri::async_runtime::spawn(db::test_db());
            tauri::async_runtime::spawn({
                let db_path = app
                    .path_resolver()
                    .app_data_dir()
                    .unwrap()
                    .join("local")
                    .with_extension("db")
                    .into_os_string()
                    .into_string()
                    .unwrap();
                setup_game_dev_api(db_path)
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
