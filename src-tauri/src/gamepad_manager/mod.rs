use std::time::Duration;

use anyhow::Error;
use gamepad_manager::{FrontendPlayerSlotConnection, GamepadManager};
use gilrs::{Event, EventType, Gilrs};
use tauri::{AppHandle, Manager, State};
use tokio::time::sleep;

use crate::frontend_api::ErrorType;
pub mod gamepad_manager;

pub async fn update_controller_task(app_handle: AppHandle) -> Result<(), Error> {
    let mut gilrs = Gilrs::new().unwrap();
    let state_manager = app_handle.state::<GamepadManager>();

    // populate gamepad_map with initial connected gamepads
    for (id, _) in gilrs.gamepads() {
        state_manager.connect_controller(id.into());
    }

    loop {
        while let Some(event) = gilrs.next_event() {
            match event {
                Event {
                    id,
                    event: EventType::Connected,
                    ..
                } => {
                    state_manager.connect_controller(id.into());
                }
                Event {
                    id,
                    event: EventType::Disconnected,
                    ..
                } => {
                    state_manager.disconnect_controller(id.into());
                }
                _ => (),
            }
        }
        print!("{esc}[2J{esc}[1;1H", esc = 27 as char);
        sleep(Duration::from_millis(50)).await;
    }
}

#[tauri::command]
pub fn get_player_slot_states(
    manager: State<'_, GamepadManager>,
) -> Result<Vec<FrontendPlayerSlotConnection>, ErrorType> {
    Ok(manager.get_slots())
}

/// Note: arguments are NOT zero indexed
#[tauri::command]
pub fn swap_player_slots(manager: State<'_, GamepadManager>, slot1: usize, slot2: usize) {
    manager.swap_slots(slot1, slot2);
}
