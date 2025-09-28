use std::collections::HashMap;
use std::fmt;
use std::fmt::Display;
use std::time::Duration;

use inner::GamepadManagerInner;
use serde::Serialize;
use std::sync::Arc;
use std::sync::RwLock;
use tokio::sync::broadcast::Sender;
use tokio::task::JoinHandle;
use tokio::time::sleep;

pub const MAX_CONTROLLERS: usize = 8;

#[derive(Debug)]
enum ControllerSlotConnectionStatus {
    Connected(usize), // the usize is the id of the Gamepad
    Disconnected,
    Stale(usize, JoinHandle<()>),
}

/// Prints a neat display of the controller slot connections
impl Display for ControllerSlotConnectionStatus {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        const RED: &str = "\x1b[31m";
        const YELLOW: &str = "\x1b[33m";
        const GREEN: &str = "\x1b[32m";
        const RESET: &str = "\x1b[0m";
        const SQUARE: &str = "⬛";
        match self {
            ControllerSlotConnectionStatus::Connected(gamepad_id) => {
                write!(f, "{}{} {}", GREEN, gamepad_id, RESET)
            }
            ControllerSlotConnectionStatus::Disconnected => write!(f, "{}{}{}", RED, SQUARE, RESET),
            ControllerSlotConnectionStatus::Stale(gamepad_id, _) => {
                write!(f, "{}{} {}", YELLOW, gamepad_id, RESET)
            }
        }
    }
}

impl Into<FrontendControllerSlotConnection> for &ControllerSlotConnectionStatus {
    fn into(self) -> FrontendControllerSlotConnection {
        match self {
            ControllerSlotConnectionStatus::Connected(_) => FrontendControllerSlotConnection::Connected,
            ControllerSlotConnectionStatus::Disconnected => FrontendControllerSlotConnection::Disconnected,
            ControllerSlotConnectionStatus::Stale(_, _) => FrontendControllerSlotConnection::Stale,
        }
    }
}

#[derive(Serialize, Clone, PartialEq, Eq, Debug)]
pub enum FrontendControllerSlotConnection {
    Connected,
    Disconnected,
    Stale,
}

/// Represents the state of every controller connection.
///
/// All methods are thread safe, no Mutex is required for calling any methods with this object.
/// However, these methods may be blocking if another thread is also reading or modifying this object
/// through the provided methods.
pub struct GamepadManager {
    state: Arc<RwLock<GamepadManagerInner>>,
    timeout_s: f32
}

impl GamepadManager {
    pub fn new(sender: Sender<Vec<FrontendControllerSlotConnection>>, timeout_s: f32) -> Self {
        GamepadManager {
            state: Arc::new(RwLock::new(GamepadManagerInner::new(sender))),
            timeout_s: timeout_s
        }
    }

    /// Registers or reconnects a controller to the Gamepad manager. Stale controllers will be 
    /// reconnected and new controllers will be assigned the next available slot.
    /// 
    /// # Arguments
    /// 
    /// * `id` - The id of the controller that was plugged in
    pub fn connect_controller(&self, id: usize) {
        // Check if the connected controller was previously stale
        let mut lock = self.state.write().unwrap();
        if let Some(slot) = lock.get_slot_num(&id) {
            let slot = *slot;
            match lock.get_slot(slot) {
                ControllerSlotConnectionStatus::Stale(_, timer) => {
                    timer.abort();
                    lock.set_slot(slot, ControllerSlotConnectionStatus::Connected(id));
                }
                _ => panic!("Controller {} is not stale but is being reconnected", id),
            }
        } else {
            // Connect the new controller
            let next_slot = lock.get_next_slot_num();
            if let Some(open_slot) = next_slot {
                lock.register_id(id, open_slot);
                lock.set_slot(open_slot, ControllerSlotConnectionStatus::Connected(id));
            }
        }
    }

    /// Unregisters a controller with a given id from the gamepad manager. This will open up
    /// a controller slot, and other controller connections will remain unaffected (they will
    /// not be moved to fill in the hole).
    /// 
    /// # Arguments
    /// 
    /// * `id` - The id of the controller that was disconnected
    pub fn disconnect_controller(&self, id: usize) {
        let mut lock = self.state.write().unwrap();
        if let Some(slot_num) = lock.get_slot_num(&id) {
            let slot_num = *slot_num;
            lock.set_slot(
                slot_num,
                ControllerSlotConnectionStatus::Stale(
                    id,
                    tokio::spawn(Self::stale_timer(id, self.timeout_s , Arc::clone(&self.state))),
                ),
            );
        }
    }

    /// Swap the controllers for two given slots. Arguments are one-indexed, so player 1
    /// is assigned to slot 1.
    /// 
    /// # Arguments
    /// 
    /// * `slot1` - The first slot number to switch
    /// * `slot2` - The second slot number to switch
    pub fn swap_slots(&self, mut slot1: usize, mut slot2: usize) {
        slot1 -= 1;
        slot2 -= 1;
        let mut lock = self.state.write().unwrap();
        lock.swap_slots(slot1, slot2);
    }

    /// Get the current state of the controller slot connections.
    /// 
    /// # Returns
    /// 
    /// * `Vec<FrontendControllerSlotConnection>` - a Vec with each index being connected, disconnected,
    /// or stale
    pub fn get_slots(&self) -> Vec<FrontendControllerSlotConnection> {
        let lock = self.state.read().unwrap();
        lock.get_slots().iter().map(|value| value.into()).collect()
    }

    /// Set a timer for when a controller is discnnected. The slot will remain stale for the given timeout and then
    /// will be disconnected.
    /// 
    /// # Arguments
    /// 
    /// * `id` - The id of the controller to set a stale timer for
    /// * `timeout_s` - The timeout duration before the controller is disconnected
    /// * `slots` - 
    async fn stale_timer(id: usize, timeout_s: f32, slots: Arc<RwLock<GamepadManagerInner>>) {
        sleep(Duration::from_secs_f32(timeout_s)).await;
        let mut lock = slots.write().unwrap();
        let slot: usize;
        if let Some(slot_num) = lock.get_slot_num(&id) {
            slot = *slot_num
        } else {
            panic!("Stale controller not in gamepad map")
        }
        lock.set_slot(slot, ControllerSlotConnectionStatus::Disconnected);
        lock.remove_id(&id);
    }
}

mod inner {
    use super::*;
    pub struct GamepadManagerInner {
        player_slots: [ControllerSlotConnectionStatus; MAX_CONTROLLERS],
        gamepad_map: HashMap<usize, usize>,
        sender: Sender<Vec<FrontendControllerSlotConnection>>,
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
        pub fn new(sender: Sender<Vec<FrontendControllerSlotConnection>>) -> Self {
            GamepadManagerInner {
                player_slots: [const { ControllerSlotConnectionStatus::Disconnected }; MAX_CONTROLLERS],
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

        pub fn get_slot(&self, slot_num: usize) -> &ControllerSlotConnectionStatus {
            &self.player_slots[slot_num]
        }

        pub fn get_slot_num(&self, id: &usize) -> Option<&usize> {
            self.gamepad_map.get(id)
        }

        pub fn get_slots(&self) -> &[ControllerSlotConnectionStatus; MAX_CONTROLLERS] {
            &self.player_slots
        }

        pub fn set_slot(&mut self, slot_num: usize, value: ControllerSlotConnectionStatus) {
            self.player_slots[slot_num] = value;
            self.broadcast_state();
        }

        pub fn register_id(&mut self, id: usize, slot_num: usize) {
            self.gamepad_map.insert(id, slot_num);
        }

        pub fn remove_id(&mut self, id: &usize) {
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
                    ControllerSlotConnectionStatus::Connected(gamepad_id) => {
                        slot_1_id = Some(*gamepad_id)
                    }
                    ControllerSlotConnectionStatus::Stale(gamepad_id, _) => {
                        slot_1_id = Some(*gamepad_id)
                    }
                    _ => (),
                }

                match slot_2_state {
                    ControllerSlotConnectionStatus::Connected(gamepad_id) => {
                        slot_2_id = Some(*gamepad_id)
                    }
                    ControllerSlotConnectionStatus::Stale(gamepad_id, _) => {
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

            self.player_slots.swap(slot1, slot2);
            self.broadcast_state();
        }

        /// Get the index of the lowest slot number that is disconnected in a given array of player slot connections
        pub fn get_next_slot_num(&self) -> Option<usize> {
            for (i, connection) in self.player_slots.iter().enumerate() {
                match connection {
                    ControllerSlotConnectionStatus::Disconnected => return Some(i),
                    _ => (),
                }
            }
            return None;
        }
    }
}
