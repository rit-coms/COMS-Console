use std::collections::HashMap;
use std::fmt;
use std::fmt::Display;
use std::sync::mpsc::Sender;
use std::time::Duration;

use gilrs::GamepadId;
use inner::GamepadManagerInner;
use serde::Serialize;
use std::sync::Arc;
use std::sync::RwLock;
use tokio::task::JoinHandle;
use tokio::time::sleep;

const CONTROLLER_STALE_TIME: Duration = Duration::from_secs(30);

pub const MAX_CONTROLLERS: usize = 8;

#[derive(Debug)]
enum PlayerSlotConnectionStatus {
    Connected(GamepadId),
    Disconnected,
    Stale(GamepadId, JoinHandle<()>),
}

impl Display for PlayerSlotConnectionStatus {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        const RED: &str = "\x1b[31m";
        const YELLOW: &str = "\x1b[33m";
        const GREEN: &str = "\x1b[32m";
        const RESET: &str = "\x1b[0m";
        const SQUARE: &str = "⬛";
        match self {
            PlayerSlotConnectionStatus::Connected(gamepad_id) => {
                write!(f, "{}{} {}", GREEN, gamepad_id, RESET)
            }
            PlayerSlotConnectionStatus::Disconnected => write!(f, "{}{}{}", RED, SQUARE, RESET),
            PlayerSlotConnectionStatus::Stale(gamepad_id, _) => {
                write!(f, "{}{} {}", YELLOW, gamepad_id, RESET)
            }
        }
    }
}

impl Into<FrontendPlayerSlotConnection> for &PlayerSlotConnectionStatus {
    fn into(self) -> FrontendPlayerSlotConnection {
        match self {
            PlayerSlotConnectionStatus::Connected(_) => FrontendPlayerSlotConnection::Connected,
            PlayerSlotConnectionStatus::Disconnected => FrontendPlayerSlotConnection::Disconnected,
            PlayerSlotConnectionStatus::Stale(_, _) => FrontendPlayerSlotConnection::Stale,
        }
    }
}

#[derive(Serialize)]
pub enum FrontendPlayerSlotConnection {
    Connected,
    Disconnected,
    Stale,
}

/// Represents the state of every controller connection.
///
/// All methods are thread save, no Mutex is required for calling any methods with this object.
/// However, these methods may be blocking if another thread is also reading or modifying this object
/// through the provided methods.
pub struct GamepadManager {
    state: Arc<RwLock<GamepadManagerInner>>,
}

impl GamepadManager {
    pub fn new(sender: Sender<Vec<FrontendPlayerSlotConnection>>) -> Self {
        GamepadManager {
            state: Arc::new(RwLock::new(GamepadManagerInner::new(sender))),
        }
    }

    pub fn connect_controller(&self, id: GamepadId) {
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

    pub fn disconnect_controller(&self, id: GamepadId) {
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

    /// Note: arguments are one-indexed NOT zero indexed.
    pub fn swap_slots(&self, mut slot1: usize, mut slot2: usize) {
        slot1 -= 1;
        slot2 -= 1;
        let mut lock = self.state.write().unwrap();
        lock.swap_slots(slot1, slot2);
    }

    pub fn get_slots(&self) -> Vec<FrontendPlayerSlotConnection> {
        let lock = self.state.read().unwrap();
        lock.get_slots().iter().map(|value| value.into()).collect()
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
    }
}

mod inner {
    use std::sync::mpsc::Sender;

    use super::*;
    pub struct GamepadManagerInner {
        player_slots: [PlayerSlotConnectionStatus; MAX_CONTROLLERS],
        gamepad_map: HashMap<GamepadId, usize>,
        sender: Sender<Vec<FrontendPlayerSlotConnection>>,
    }

    impl fmt::Display for GamepadManagerInner {
        fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
            for slot in self.player_slots.iter() {
                write!(f, "{}", slot)?;
            }
            Ok(())
        }
    }

    impl GamepadManagerInner {
        pub fn new(sender: Sender<Vec<FrontendPlayerSlotConnection>>) -> Self {
            GamepadManagerInner {
                player_slots: [const { PlayerSlotConnectionStatus::Disconnected }; MAX_CONTROLLERS],
                gamepad_map: HashMap::new(),
                sender: sender,
            }
        }

        fn broadcast_state(&self) {
            // Ignore the error for if the reciever is dropped (it shouldn't be dropped)
            println!("{}", self);
            let _ = self
                .sender
                .send(self.player_slots.iter().map(|value| value.into()).collect());
        }

        pub fn get_slot(&self, slot_num: usize) -> &PlayerSlotConnectionStatus {
            &self.player_slots[slot_num]
        }

        pub fn get_slot_num(&self, id: &GamepadId) -> Option<&usize> {
            self.gamepad_map.get(id)
        }

        pub fn get_slots(&self) -> &[PlayerSlotConnectionStatus; MAX_CONTROLLERS] {
            &self.player_slots
        }

        pub fn set_slot(&mut self, slot_num: usize, value: PlayerSlotConnectionStatus) {
            self.player_slots[slot_num] = value;
            self.broadcast_state();
        }

        pub fn register_id(&mut self, id: GamepadId, slot_num: usize) {
            self.gamepad_map.insert(id, slot_num);
        }

        pub fn remove_id(&mut self, id: &GamepadId) {
            self.gamepad_map.remove(id);
        }

        pub fn swap_slots(&mut self, slot1: usize, slot2: usize) {
            let mut slot_1_id = None;
            let mut slot_2_id = None;
            {
                let slot_1_state = self.get_slot(slot1);
                let slot_2_state = self.get_slot(slot2);
                // Update id to slot mappings
                match slot_1_state {
                    PlayerSlotConnectionStatus::Connected(gamepad_id) => {
                        slot_1_id = Some(*gamepad_id)
                    }
                    PlayerSlotConnectionStatus::Stale(gamepad_id, _) => {
                        slot_1_id = Some(*gamepad_id)
                    }
                    _ => (),
                }

                match slot_2_state {
                    PlayerSlotConnectionStatus::Connected(gamepad_id) => {
                        slot_2_id = Some(*gamepad_id)
                    }
                    PlayerSlotConnectionStatus::Stale(gamepad_id, _) => {
                        slot_2_id = Some(*gamepad_id)
                    }
                    _ => (),
                }
            }

            if let Some(id) = slot_1_id {
                self.register_id(id, slot2);
            }
            if let Some(id) = slot_2_id {
                self.register_id(id, slot1);
            }

            // Make sure we don't go out of the memory range of the array
            assert!(slot1 < self.player_slots.len() && slot2 < self.player_slots.len());
            unsafe {
                let ptr_1 = self.player_slots.as_mut_ptr().add(slot1);
                let ptr_2 = self.player_slots.as_mut_ptr().add(slot2);

                std::ptr::swap(ptr_1, ptr_2);
            }

            self.broadcast_state();
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
