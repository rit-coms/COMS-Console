use std::{
    collections::{HashMap, HashSet},
    pin::Pin,
    sync::RwLock,
    time::{Duration, SystemTime},
};

use anyhow::{anyhow, Error};
use gilrs::{Event, EventType, GamepadId, Gilrs};
use tauri::{AppHandle, Manager, State};
use tokio::time::{sleep, Sleep};

pub const MAX_CONTROLLERS: usize = 8;
const CONTROLLER_STALE_TIME: Duration = Duration::new(30, 0);

#[derive(Debug)]
struct GamepadConnectionStatus {
    connected: bool,
    disconnect_time: Option<SystemTime>,
    player_slot: usize, // This is the same as the index for the list of player slots
}

#[derive(Default, PartialEq, Eq, Clone, Copy, Debug)]
pub enum PlayerSlotConnectionStatus {
    Connected(GamepadId),
    #[default]
    Disconnected,
    Stale(GamepadId),
}

#[derive(Default)]
pub struct PlayerSlotInner([PlayerSlotConnectionStatus; MAX_CONTROLLERS as usize]); // slots range from [0..MAX_CONTROLLERS)
pub type PlayerSlotState = RwLock<PlayerSlotInner>;

// TODO: remove all unwraps with the RwLock (not gilrs initialization)
// and handle poisoning of the RwLock
pub async fn update_controller_task(app_handle: AppHandle) -> Result<(), Error> {
    let mut gilrs = Gilrs::new().unwrap();
    let mut player_slots = [PlayerSlotConnectionStatus::default(); MAX_CONTROLLERS];
    let mut gamepad_map: HashMap<GamepadId, GamepadConnectionStatus> = HashMap::new(); // This stores all information regarding gamepad connections
    let mut stale_sleep: HashMap<GamepadId, Pin<Box<Sleep>>> = HashMap::new();
    let mut connected_num = 0;

    // populate gamepad_map with initial connected gamepads
    let mut slot_num: usize = 0;
    for (id, _) in gilrs.gamepads() {
        let slot = GamepadConnectionStatus {
            connected: true,
            disconnect_time: None,
            player_slot: slot_num,
        };
        gamepad_map.insert(id, slot);

        if connected_num < MAX_CONTROLLERS {
            player_slots[slot_num] = PlayerSlotConnectionStatus::Connected(id); 
            slot_num += 1;
        } else {
            println!("Ignoring overflow controller with id: {}", id)
        }

        connected_num += 1;
    }

    loop {
        while let Some(event) = gilrs.next_event() {
            match event {
                Event {
                    id,
                    event: EventType::Connected,
                    ..
                } => {
                    let slot_num = next_slot_num_under_max(&player_slots);
                    if let Some(slot_num) = slot_num {
                        if let Some(slot) = gamepad_map.get_mut(&id) {
                            slot.connected = true;
                            slot.disconnect_time = None;
                            slot.player_slot = slot_num;
                            player_slots[slot_num] = PlayerSlotConnectionStatus::Connected(id);
                        } else {
                            let slot: GamepadConnectionStatus = GamepadConnectionStatus {
                                connected: true,
                                disconnect_time: None,
                                player_slot: slot_num,
                            };
                            gamepad_map.insert(id, slot);
                            stale_sleep.remove(&id);
                        }
                        println!("Controller connected with id : {}", id);
                    } else {
                        println!("Connected controller with id {} ignored due to no open controller slots", id)
                    }
                }
                Event {
                    id,
                    event: EventType::Disconnected,
                    time,
                } => {
                    if let Some(slot) = gamepad_map.get_mut(&id) {
                        slot.connected = false;
                        slot.disconnect_time = Some(time);
                        player_slots[slot.player_slot] = PlayerSlotConnectionStatus::Disconnected;
                        println!("Disconnected slot with id: {}", &id);

                        connected_num -= 1;

                        let new_sleep = Box::pin(sleep(CONTROLLER_STALE_TIME));
                        stale_sleep.insert(id, new_sleep);
                        stale_sleep.get_mut(&id).unwrap().await;
                    } else {
                        println!("Unidentified gamepad is disconnecting!");
                    }
                    println!("Controller Disconnected");
                }
                _ => (),
            }
        }
        stale_sleep.retain(|id, sleep| {
            if sleep.is_elapsed() {
                gamepad_map.remove(id);
                return false;
            }
            true
        });
        print!("{esc}[2J{esc}[1;1H", esc = 27 as char);
        println!("{:#?}", gamepad_map);
        println!(
            "{:#?}",
            get_player_slot_states(app_handle.state::<PlayerSlotState>())
        );
        sleep(Duration::from_millis(50)).await;
    }
}

#[tauri::command]
pub fn get_player_slot_states(
    state: State<'_, PlayerSlotState>,
) -> [PlayerSlotConnectionStatus; MAX_CONTROLLERS as usize] {
    state.read().unwrap().0
}

#[tauri::command]
pub fn swap_player_slots(state: State<'_, PlayerSlotState>, slot_num_1: usize, slot_num_2: usize) {
    let player_slots = &mut state.write().unwrap().0;
    player_slots.swap(slot_num_1, slot_num_2);
}

/// Get the index of the lowest slot number that is disconnected in a given array of
fn next_slot_num_under_max(connections: &[PlayerSlotConnectionStatus]) -> Option<usize> {
    for (i, connection) in connections.iter().enumerate() {
        if connection == &PlayerSlotConnectionStatus::Disconnected {
            return Some(i);
        }
    }
    return None;
}

#[cfg(test)]
mod tests {
    fn next_slot_num_under_max() {
        todo!()
    }
    fn get_next_slot_over_max() {
        todo!()
    }

    fn swap_player_with_empty() {
        todo!()
    }
    fn swap_player_slot() {
        todo!()
    }
}
