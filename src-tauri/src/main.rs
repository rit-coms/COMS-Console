// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::mpsc::{Receiver, Sender};

use frontend_api::{get_game_info, play_game, LoadedGamesState};
use game_dev_api::setup_game_dev_api;
use gamepad_manager::{swap_player_slots, update_controller_task, PlayerSlotState};
use tauri::Manager;
use tauri_plugin_autostart::{MacosLauncher, ManagerExt};
use tokio::sync::broadcast;

mod frontend_api;
mod game_dev_api;
mod db;
mod gamepad_manager;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec![""]),
        ))
        .setup(|app| {
            // TODO: Is 10 a good capacity?
            let (controller_slot_sender , mut controller_slot_reciever) = broadcast::channel(10);
            app.manage(LoadedGamesState::default());
            app.manage(controller_slot_reciever);
            // tauri::async_runtime::spawn(db::test_db());
            tauri::async_runtime::spawn(setup_game_dev_api("local"));
            tauri::async_runtime::spawn(update_controller_task());
            if cfg!(feature = "autostart") {
                // Only enable autolaunch on raspberry pi
                app.autolaunch().enable()?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_game_info, play_game])
        .invoke_handler(tauri::generate_handler![swap_player_slots])
        .on_page_load(|window, _| {
            window.show().expect("Failed to show window");
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
