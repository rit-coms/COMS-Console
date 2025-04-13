use std::{
    collections::HashMap,
    sync::{Arc, RwLock},
};

use gilrs::GamepadId;
use tokio::task::JoinHandle;

pub const MAX_CONTROLLERS: usize = 8;

#[derive(Debug)]
pub enum PlayerSlotConnectionStatus {
    Connected(GamepadId),
    Disconnected,
    Stale(GamepadId, JoinHandle<()>),
}

pub struct GamepadManagerState {
    state: RwLock<InnerState>,
}

struct InnerState {
    player_slots: [PlayerSlotConnectionStatus; MAX_CONTROLLERS],
    gamepad_map: HashMap<GamepadId, usize>,
    connected_num: u8,
}

impl GamepadManagerState {
    fn new() -> Self {
        GamepadManagerState {
            state: RwLock::new(InnerState {
                player_slots: [const { PlayerSlotConnectionStatus::Disconnected }; MAX_CONTROLLERS],
                gamepad_map: HashMap::new(),
                connected_num: 0,
            }),
        }
    }

    fn onControllerReconnect(&self, id: GamepadId) {
        let mut lock = self.state.write().unwrap();
        // Check if the connected controller was previously stale
        if let Some(slot) = lock.gamepad_map.get(&id).cloned() {
            match &lock.player_slots[slot] {
                PlayerSlotConnectionStatus::Stale(_, timer) => {
                    timer.abort();
                    lock.player_slots[slot] = PlayerSlotConnectionStatus::Connected(id);
                    println!("Slot {} reconnected!", slot);
                }
                _ => panic!("Controller {} is not stale but is being reconnected", id),
            }
        } else {
            // Connect the new controller
            let next_slot = get_next_slot_num_under_max(&lock.player_slots);
            if let Some(open_slot) = next_slot {
                lock.gamepad_map.insert(id, open_slot);
                println!("ID of {} associated with slot {}", id, open_slot);
                lock.player_slots[open_slot] = PlayerSlotConnectionStatus::Connected(id);
                println!("Controller to slot {} with id : {}", open_slot, id);
            }
        }
    }
}

/// Get the index of the lowest slot number that is disconnected in a given array of player slot connections
fn get_next_slot_num_under_max(connections: &[PlayerSlotConnectionStatus]) -> Option<usize> {
    for (i, connection) in connections.iter().enumerate() {
        match connection {
            PlayerSlotConnectionStatus::Disconnected => return Some(i),
            _ => (),
        }
    }
    return None;
}
