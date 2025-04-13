use std::{
    char::MAX,
    collections::{HashMap, HashSet},
    pin::Pin,
    sync::{Arc, Mutex, RwLock},
    time::{Duration, SystemTime},
};

use anyhow::{anyhow, Error};
use gilrs::{Event, EventType, GamepadId, Gilrs};
use tauri::{AppHandle, Manager, State};
use tokio::{
    task::JoinHandle,
    time::{sleep, Sleep},
};

pub const MAX_CONTROLLERS: usize = 8;
const CONTROLLER_STALE_TIME: Duration = Duration::from_secs(30);

#[derive(Debug)]
pub enum PlayerSlotConnectionStatus {
    Connected(GamepadId),
    Disconnected,
    Stale(GamepadId, JoinHandle<()>),
}

type Slots = Arc<RwLock<[PlayerSlotConnectionStatus; MAX_CONTROLLERS]>>;

pub async fn update_controller_task() -> Result<(), Error> {
    let mut gilrs = Gilrs::new().unwrap();
    let mut player_slots = [const { PlayerSlotConnectionStatus::Disconnected }; MAX_CONTROLLERS];
    // This maps GamepadId's to player slot indicies
    let mut gamepad_map: HashMap<GamepadId, usize> = HashMap::new();
    let mut connected_num = 0;

    // populate gamepad_map with initial connected gamepads
    let mut slot_num: usize = 0;
    for (id, _) in gilrs.gamepads() {
        gamepad_map.insert(id, slot_num);

        if connected_num < MAX_CONTROLLERS {
            player_slots[slot_num] = PlayerSlotConnectionStatus::Connected(id);
            slot_num += 1;
        } else {
            println!("Ignoring overflow controller with id: {}", id)
        }

        connected_num += 1;
    }

    // Now that the player slots are initialized, wrap the array in and Arc and a RwLock
    // Note: the std RwLock is being used here because no async code will be run when the lock is held (I think)
    let mut player_slots: Slots = Arc::new(RwLock::new(player_slots));
    let mut gamepad_map = Arc::new(RwLock::new(gamepad_map));

    loop {
        while let Some(event) = gilrs.next_event() {
        let slots_handle = Arc::clone(&player_slots);
        let map_handle = Arc::clone(&gamepad_map);
            match event {
                Event {
                    id,
                    event: EventType::Connected,
                    ..
                } => {
                    let mut locked_slots = slots_handle.write().unwrap();
                    let mut locked_map = map_handle.write().unwrap();
                    // Check if the connected controller was previously stale
                    if let Some(slot) = locked_map.get(&id) {
                        match &locked_slots[*slot] {
                            PlayerSlotConnectionStatus::Stale(_, timer) => {
                                timer.abort(); // Cancel the timer
                                locked_slots[*slot] = PlayerSlotConnectionStatus::Connected(id);
                                println!("Slot {} reconnected!", slot);
                            }
                            _ => panic!("Controller {} is not stale but is being reconnected", id),
                        }
                    } else {
                        // Connect the new controller
                        let next_slot = next_slot_num_under_max(&*locked_slots);
                        if let Some(open_slot) = next_slot {
                            locked_map.insert(id, open_slot);
                            println!("ID of {} associated with slot {}", id, open_slot);
                            locked_slots[open_slot] = PlayerSlotConnectionStatus::Connected(id);
                            println!("Controller to slot {} with id : {}", open_slot, id);
                        }
                    }
                }
                Event {
                    id,
                    event: EventType::Disconnected,
                    time,
                } => {
                    let slots_handle = Arc::clone(&player_slots);
                    let mut locked_slots = slots_handle.write().unwrap();
                    let slot_num;
                    {
                        let map_handle = Arc::clone(&gamepad_map);
                        let lock = map_handle.read().unwrap();
                        slot_num = lock.get(&id);
                    }
                    if let Some(slot) = slot_num {
                        // Here the Stale enum will store a handle for the async operation that can be canceled by other threads
                        locked_slots[*slot] = PlayerSlotConnectionStatus::Stale(
                            id,
                            tokio::spawn(async move {
                                sleep(CONTROLLER_STALE_TIME);
                                // Lock the id to slot map and the slots
                                let slots_lock = slots_handle.write().unwrap();
                                let map_lock = map_handle.write().unwrap();
                                // Update map and player slots
                            }),
                        );

                        connected_num -= 1;
                    } else {
                        println!("Unidentified gamepad is disconnecting!");
                    }
                    println!("Controller Disconnected");
                }
                _ => (),
            }
        }
        print!("{esc}[2J{esc}[1;1H", esc = 27 as char);
        println!("{:#?}", gamepad_map);
        sleep(Duration::from_millis(50)).await;
    }
}

#[tauri::command]
pub async fn get_player_slot_states(
) -> Result<[PlayerSlotConnectionStatus; MAX_CONTROLLERS as usize], Error> {
    Ok(*state.read().await)
}

#[tauri::command]
pub fn swap_player_slots(state: State<'_, PlayerSlotState>, slot_num_1: usize, slot_num_2: usize) {
    let player_slots = &mut state.write().unwrap().0;
    player_slots.swap(slot_num_1, slot_num_2);
}

/// Get the index of the lowest slot number that is disconnected in a given array of player slot connections
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
