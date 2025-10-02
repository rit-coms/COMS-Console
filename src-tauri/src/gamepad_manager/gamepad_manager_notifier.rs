use tauri::{AppHandle, Emitter};
use tokio::sync::broadcast::Sender;

use crate::gamepad_manager::gamepad_manager::{FrontendControllerSlotConnection, GamepadManager};

pub struct GamepadManagerNotifier {
    gamepad_manager: GamepadManager,
    app_handle: AppHandle
}

impl GamepadManagerNotifier {
    pub fn new(sender: Sender<Vec<FrontendControllerSlotConnection>>, timeout_s: f32, app_handle: AppHandle) -> Self {
        GamepadManagerNotifier{
            gamepad_manager: GamepadManager::new(sender, timeout_s),
            app_handle
        }
    }

    fn notify(&self) {
        self.app_handle.emit("controller-connections-updated", self.gamepad_manager.get_slots());
    }

    pub fn connect_controller(&self, id: usize) {
        self.gamepad_manager.connect_controller(id);
        self.notify();
    }

    pub fn disconnect_controller(&self, id: usize) {
        self.gamepad_manager.disconnect_controller(id);
        self.notify();
    }

    pub fn swap_slots(&self, slot1: usize, slot2: usize) {
        self.gamepad_manager.swap_slots(slot1, slot2);
        self.notify();
    }

    pub fn get_slots(&self) -> Vec<FrontendControllerSlotConnection> {
        self.gamepad_manager.get_slots()    
    }
}