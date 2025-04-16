use std::collections::HashMap;
use std::time::Duration;

use gilrs::GamepadId;
use inner::GamepadManagerInner;
use std::sync::Arc;
use std::sync::RwLock;
use tokio::task::JoinHandle;
use tokio::time::sleep;

const CONTROLLER_STALE_TIME: Duration = Duration::from_secs(30);

pub const MAX_CONTROLLERS: usize = 8;

#[derive(Debug)]
pub enum PlayerSlotConnectionStatus {
    Connected(GamepadId),
    Disconnected,
    Stale(GamepadId, JoinHandle<()>),
}

pub struct GamepadManager {
    state: Arc<RwLock<GamepadManagerInner>>,
}

impl GamepadManager {
    pub fn new() -> Self {
        GamepadManager {
            state: Arc::new(RwLock::new(GamepadManagerInner::new())),
        }
    }

    fn onControllerConnect(&self, id: GamepadId) {
        // Check if the connected controller was previously stale
        let mut lock = self.state.write().unwrap();
        if let Some(slot) = lock.get_slot_num(&id) {
            let slot = *slot;
            match lock.get_slot(slot) {
                PlayerSlotConnectionStatus::Stale(_, timer) => {
                    timer.abort();
                    lock.set_slot(slot, PlayerSlotConnectionStatus::Connected(id));
                }
                _ => panic!("Controller {} is not stale but is being reconnected", id),
            }
        } else {
            // Connect the new controller
            let next_slot = lock.get_next_slot_num_under_max();
            if let Some(open_slot) = next_slot {
                lock.register_id(id, open_slot);
                lock.set_slot(open_slot, PlayerSlotConnectionStatus::Connected(id));
            }
        }
    }

    fn onControllerDisconnect(&self, id: GamepadId) {
        let mut lock = self.state.write().unwrap();
        if let Some(slot_num) = lock.get_slot_num(&id) {
            let slot_num = *slot_num;
            lock.set_slot(
                slot_num,
                PlayerSlotConnectionStatus::Stale(
                    id,
                    tokio::spawn(Self::stale_timer(id, Arc::clone(&self.state))),
                ),
            );
        }
    }

    async fn stale_timer(id: GamepadId, slots: Arc<RwLock<GamepadManagerInner>>) {
        sleep(CONTROLLER_STALE_TIME).await;
        let mut lock = slots.write().unwrap();
        let slot: usize;
        if let Some(slot_num) = lock.get_slot_num(&id) {
            slot = *slot_num
        } else {
            panic!("Stale controller not in gamepad map")
        }
        lock.set_slot(slot, PlayerSlotConnectionStatus::Disconnected);
        lock.remove_id(&id);
        println!("Disconnected controller ID {} in slot {}", id, slot);
    }
}

mod inner {
    use super::*;
    pub struct GamepadManagerInner {
        player_slots: [PlayerSlotConnectionStatus; MAX_CONTROLLERS],
        gamepad_map: HashMap<GamepadId, usize>,
        connected_num: u8,
    }

    impl GamepadManagerInner {
        pub fn new() -> Self {
            GamepadManagerInner {
                player_slots: [const { PlayerSlotConnectionStatus::Disconnected }; MAX_CONTROLLERS],
                gamepad_map: HashMap::new(),
                connected_num: 0,
            }
        }

        pub fn get_slot(&self, slot_num: usize) -> &PlayerSlotConnectionStatus {
            &self.player_slots[slot_num]
        }

        pub fn get_slot_mut(&mut self, slot_num: usize) -> &mut PlayerSlotConnectionStatus {
            &mut self.player_slots[slot_num]
        }

        pub fn get_slot_num(&self, id: &GamepadId) -> Option<&usize> {
            self.gamepad_map.get(id)
        }

        pub fn set_slot(&mut self, slot_num: usize, value: PlayerSlotConnectionStatus) {
            println!("Slot {} set to be {:?}", slot_num, value);
            self.player_slots[slot_num] = value;
        }

        pub fn register_id(&mut self, id: GamepadId, slot_num: usize) {
            println!("ID {:?} associated with slot {}", &id, slot_num);
            self.gamepad_map.insert(id, slot_num);
        }

        pub fn remove_id(&mut self, id: &GamepadId) {
            println!("Removed controller with ID {}", id);
            self.gamepad_map.remove(id);
        }

        /// Get the index of the lowest slot number that is disconnected in a given array of player slot connections
        pub fn get_next_slot_num_under_max(&self) -> Option<usize> {
            for (i, connection) in self.player_slots.iter().enumerate() {
                match connection {
                    PlayerSlotConnectionStatus::Disconnected => return Some(i),
                    _ => (),
                }
            }
            return None;
        }
    }
}
