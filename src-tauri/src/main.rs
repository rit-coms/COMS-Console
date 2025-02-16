// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use frontend_api::games::{get_game_info, play_game, AppState};
use tauri::Manager;
use tauri_plugin_autostart::{MacosLauncher, ManagerExt};

use std::sync::Mutex;

mod frontend_api;

/// Returns true if the code is running on a raspberry pi
fn running_on_rasp_pi() -> bool {
    cfg!(all(
        target_arch = "aarch64",
        not(any(target_os = "macos", target_os = "linux"))
    ))
}

fn main() {
    tauri::Builder::default()
    .plugin(tauri_plugin_autostart::init(
        MacosLauncher::LaunchAgent,
        Some(vec![""]),
    ))
    .setup(|app| {
        app.manage(Mutex::new(AppState::default()));
        if running_on_rasp_pi() { // Only enable
            app.autolaunch().enable()?;
        }
        Ok(())
    })
    .invoke_handler(tauri::generate_handler![get_game_info, play_game])
    .on_page_load(|window, _| {
        window.show().expect("Failed to show window");
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
