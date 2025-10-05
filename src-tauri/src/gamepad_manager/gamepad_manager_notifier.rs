use tauri::{AppHandle, Emitter};
use tokio::sync::broadcast::Sender;

use crate::gamepad_manager::gamepad_manager::{FrontendControllerSlotConnection, GamepadManager};

pub struct GamepadManagerNotifier {
    gamepad_manager: GamepadManager,
    app_handle: AppHandle,
    sender: Sender<Vec<FrontendControllerSlotConnection>>,
}

impl GamepadManagerNotifier {
    pub fn new(sender: Sender<Vec<FrontendControllerSlotConnection>>, timeout_s: f32, app_handle: AppHandle) -> Self {
        GamepadManagerNotifier{
            gamepad_manager: GamepadManager::new(timeout_s),
            app_handle,
            sender,
        }
    }

    fn notify(&self) {
        let current_slots = self.gamepad_manager.get_slots();
        // Notify Tauri frontend
        self.app_handle.emit("controller-connections-updated", current_slots.clone())
            .expect("Failed to emit controller connections update to Tauri frontend");
        // Notify game webserver
        self.sender.send(current_slots)
            .expect("Failed to emit controller connection update to game dev webserver");
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