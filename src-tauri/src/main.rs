// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::{Arc, Mutex};

use frontend_api::{get_game_info, play_game, LoadedGamesState};
use game_dev_api::setup_game_dev_api;
use gamepad_manager::{
    gamepad_manager::{FrontendPlayerSlotConnection, GamepadManager},
    get_player_slot_states, swap_player_slots, update_controller_task,
};
use tauri::Manager;
use tauri_plugin_autostart::{MacosLauncher, ManagerExt};

mod db;
mod frontend_api;
mod game_dev_api;
mod gamepad_manager;
use tokio::sync::broadcast::channel;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec![""]),
        ))
        .setup(|app| {
            let (controller_slot_tx, controller_slot_rx) =
                channel::<Vec<FrontendPlayerSlotConnection>>(100);
            app.manage(LoadedGamesState::default());
            app.manage(GamepadManager::new(controller_slot_tx));
            // tauri::async_runtime::spawn(db::test_db());
            tauri::async_runtime::spawn(setup_game_dev_api("local", controller_slot_rx));
            tauri::async_runtime::spawn(update_controller_task(app.handle().clone()));
            if cfg!(feature = "autostart") {
                // Only enable autolaunch on raspberry pi
                app.autolaunch().enable()?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_game_info, play_game])
        .invoke_handler(tauri::generate_handler![
            swap_player_slots,
            get_player_slot_states
        ])
        .on_page_load(|window, _| {
            window.show().expect("Failed to show window");
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
