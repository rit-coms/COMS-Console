
use std::{ffi::os_str::Display, fmt, sync::Arc};

use tauri::{AppHandle, Emitter};
use tokio::sync::broadcast::Sender;

use crate::gamepad_manager::gamepad_manager::{FrontendControllerSlotConnection, GamepadManager};

pub struct GamepadManagerNotifier {
    gamepad_manager: Arc<GamepadManager>,
    app_handle: AppHandle,
    sender: Sender<Vec<FrontendControllerSlotConnection>>,
}

impl GamepadManagerNotifier {
    pub fn new(sender: Sender<Vec<FrontendControllerSlotConnection>>, timeout_s: f32, app_handle: AppHandle) -> Self {
        GamepadManagerNotifier{
            gamepad_manager: Arc::new(GamepadManager::new(timeout_s)),
            app_handle,
            sender,
        }
    }

    fn notify(slots: Vec<FrontendControllerSlotConnection>, app_handle: AppHandle, sender: Sender<Vec<FrontendControllerSlotConnection>>) {
        for slot in slots.iter() {
            print!("{}", slot);
        }
        println!();
        // Notify Tauri frontend
        app_handle.emit("controller-connections-updated", slots.clone())
            .expect("Failed to emit controller connections update to Tauri frontend");
        // Notify game webserver
        sender.send(slots)
            .expect("Failed to emit controller connection update to game dev webserver");
    }

    pub fn connect_controller(&self, id: usize) {
        self.gamepad_manager.connect_controller(id);
        GamepadManagerNotifier::notify(self.get_slots(), self.app_handle.clone(), self.sender.clone());
    }

    pub fn disconnect_controller(&self, id: usize) {
        let slots = self.gamepad_manager.get_slots();
        let handle = self.app_handle.clone();
        let sender = self.sender.clone();
        self.gamepad_manager.disconnect_controller(id, Box::new( move |new_slots| {
            GamepadManagerNotifier::notify(new_slots, handle.clone(), sender.clone());
        }));
        GamepadManagerNotifier::notify(self.get_slots(), self.app_handle.clone(), self.sender.clone());
    }

    pub fn swap_slots(&self, slot1: usize, slot2: usize) {
        self.gamepad_manager.swap_slots(slot1, slot2);
        GamepadManagerNotifier::notify(self.get_slots(), self.app_handle.clone(), self.sender.clone());
    }

    pub fn get_slots(&self) -> Vec<FrontendControllerSlotConnection> {
        self.gamepad_manager.get_slots()    
    }
}