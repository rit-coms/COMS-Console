// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use frontend_api::games::{get_game_info, play_game, AppState};
use game_dev_api::hello_axum;
use tauri::Manager;
use tauri_plugin_autostart::{MacosLauncher, ManagerExt};

use std::sync::Mutex;

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
            app.autolaunch().enable()?;
            tauri::async_runtime::spawn(hello_axum::setup_routes());
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_game_info, play_game])
        .on_page_load(|window, _| {
            window.show().expect("Failed to show window");
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
