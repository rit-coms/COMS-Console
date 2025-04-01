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

pub const MAX_CONTROLLERS: u8 = 8;
const CONTROLLER_STALE_TIME: Duration = Duration::new(30, 0);

#[derive(Debug)]
struct GamepadConnectionStatus {
    connected: bool,
    disconnect_time: Option<SystemTime>,
}
#[derive(Default, PartialEq, Eq, Clone, Copy, Debug)]
enum PlayerSlotConnectionStatus {
    Connected,
    #[default]
    Disconnected,
    Stale,
}
#[derive(Default, Clone, Copy, Debug)]
struct PlayerSlotConnection {
    gamepad_id: Option<GamepadId>,
    status: PlayerSlotConnectionStatus,
}

#[derive(Default)]
pub struct PlayerSlotInner([PlayerSlotConnection; MAX_CONTROLLERS as usize]); // slots range from [0..MAX_CONTROLLERS)
pub type PlayerSlotState = RwLock<PlayerSlotInner>;

fn get_next_available_slot_num(
    gamepad_map: &mut HashMap<GamepadId, GamepadConnectionStatus>,
    connected_num: u8,
    state: State<'_, PlayerSlotState>,
) -> Option<(u8, PlayerSlotConnectionStatus)> {
    if connected_num >= MAX_CONTROLLERS {
        return None;
    }
    let player_slots = &state.read().unwrap().0;
    let first_valid_slot = player_slots
        .iter()
        .enumerate()
        .find(|(_, connection)| connection.status == PlayerSlotConnectionStatus::Disconnected);
    if let Some(first_valid_slot) = first_valid_slot {
        return Some((
            first_valid_slot.0 as u8,
            PlayerSlotConnectionStatus::Disconnected,
        ));
    }
    let most_stale_slot = gamepad_map
        .iter()
        .filter_map(|(id, gp)| {
            // check if gamepad was disconnected recently and had a slot number formerly
            if player_slots.iter().any(|conn| {
                if let Some(current_id) = conn.gamepad_id {
                    return current_id == *id;
                }
                false
            }) && !gp.connected
            {
                Some((id, gp));
            }
            None
        })
        .min_by(
            |(_, gp1): &(GamepadId, GamepadConnectionStatus),
             (_, gp2): &(GamepadId, GamepadConnectionStatus)| {
                gp1.disconnect_time.cmp(&gp2.disconnect_time)
            },
        );
    if let Some((most_stale_slot_id, _)) = most_stale_slot {
        if let Some(stale_slot) = player_slots.iter().enumerate().find(|(_, conn)| {
            if let Some(current_id) = conn.gamepad_id {
                return current_id == most_stale_slot_id;
            }
            false
        }) {
            return Some((stale_slot.0 as u8, stale_slot.1.status));
        }
    }
    // if we reach here, than there were no valid slots or stale slots
    // that could be replaced and somehow the connected_num of controllers was off
    None
}

// TODO: remove all unwraps with the RwLock (not gilrs initialization)
// and handle poisoning of the RwLock
pub async fn update_controller_task(app_handle: AppHandle) -> Result<(), Error> {
    let mut gilrs = Gilrs::new().unwrap();
    let player_slots_state = app_handle.state::<PlayerSlotState>();
    let mut gamepad_map: HashMap<GamepadId, GamepadConnectionStatus> = HashMap::new();
    let mut stale_sleep: HashMap<GamepadId, Pin<Box<Sleep>>> = HashMap::new();
    let mut gamepad_overflow_ids: HashSet<GamepadId> = HashSet::new();
    let mut connected_num = 0;

    {
        // populate gamepad_map with initial connected gamepads
        let player_slots = &mut player_slots_state.write().unwrap().0;
        let mut slot_num = 0;
        for (id, _) in gilrs.gamepads() {
            let slot = GamepadConnectionStatus {
                connected: true,
                disconnect_time: None,
            };
            gamepad_map.insert(id, slot);

            if connected_num < MAX_CONTROLLERS {
                player_slots[slot_num as usize] = PlayerSlotConnection {
                    gamepad_id: Some(id),
                    status: PlayerSlotConnectionStatus::Connected,
                };
                slot_num += 1;
            } else {
                gamepad_overflow_ids.insert(id);
            }

            connected_num += 1;
        }
    }

    loop {
        while let Some(event) = gilrs.next_event() {
            match event {
                Event {
                    id,
                    event: EventType::Connected,
                    ..
                } => {
                    if let Some(slot) = gamepad_map.get_mut(&id) {
                        slot.connected = true;
                        slot.disconnect_time = None;
                    } else {
                        let slot: GamepadConnectionStatus = GamepadConnectionStatus {
                            connected: true,
                            disconnect_time: None,
                        };
                        gamepad_map.insert(id, slot);
                        stale_sleep.remove(&id);
                        if let Some((next_slot_num, previous_status)) = get_next_available_slot_num(
                            &mut gamepad_map,
                            connected_num,
                            app_handle.state::<PlayerSlotState>(),
                        ) {
                            if previous_status == PlayerSlotConnectionStatus::Stale {
                                // if stale, remove the previous gamepad from the gamepad_map
                                let old_connected_id = get_id_of_slot(
                                    next_slot_num as usize,
                                    app_handle.state::<PlayerSlotState>(),
                                );
                                if let Some(old_connected_id) = old_connected_id {
                                    gamepad_map.remove(&old_connected_id);
                                }
                            }
                            // set the state of the slot to be connected with the connected id
                            let mut player_slots =
                                app_handle.state::<PlayerSlotState>().write().unwrap().0;
                            player_slots[next_slot_num as usize] = PlayerSlotConnection {
                                gamepad_id: Some(id),
                                status: PlayerSlotConnectionStatus::Connected,
                            };
                        } else {
                            gamepad_overflow_ids.insert(id);
                        }
                        connected_num += 1;
                    }
                    println!("Controller Connected");
                }
                Event {
                    id,
                    event: EventType::Disconnected,
                    time,
                } => {
                    if let Some(slot) = gamepad_map.get_mut(&id) {
                        if let Some(_slot_of_connected) =
                            get_slot_num(&id, app_handle.state::<PlayerSlotState>())
                        {
                            if let Some(overflow_id) = gamepad_overflow_ids.iter().next() {
                                set_slot_by_id(
                                    &id,
                                    &PlayerSlotConnection {
                                        gamepad_id: Some(*overflow_id),
                                        status: PlayerSlotConnectionStatus::Connected,
                                    },
                                    app_handle.state::<PlayerSlotState>(),
                                )?;
                            } else {
                                set_status_by_id(
                                    &id, 
                                    PlayerSlotConnectionStatus::Stale, 
                                    app_handle.state::<PlayerSlotState>()
                                )?;
                            }
                        } else {
                            gamepad_overflow_ids.remove(&id);
                        }
                        slot.connected = false;
                        slot.disconnect_time = Some(time);

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
        println!("{:#?}", get_player_slot_states(app_handle.state::<PlayerSlotState>()));
        sleep(Duration::from_millis(50)).await;
    }
}

fn get_id_of_slot(slot_num: usize, state: State<'_, PlayerSlotState>) -> Option<GamepadId> {
    let player_slots = &state.read().unwrap().0;
    return player_slots[slot_num].gamepad_id;
}

fn get_slot_num(id: &GamepadId, state: State<'_, PlayerSlotState>) -> Option<u8> {
    let player_slots = &state.read().unwrap().0;
    player_slots
        .iter()
        .enumerate()
        .find_map(|(slot_num, conn)| {
            if let Some(current_id) = conn.gamepad_id {
                if current_id == *id {
                    return Some(slot_num as u8);
                }
            }
            None
        })
}

fn set_status_by_id(
    id: &GamepadId,
    status: PlayerSlotConnectionStatus,
    state: State<'_, PlayerSlotState>,
) -> Result<(), Error> {
    let player_slots = &mut state.write().unwrap().0;
    let slot = player_slots.iter().enumerate().find(|(_slot_num, conn)| {
        if let Some(current_id) = conn.gamepad_id {
            if current_id == *id {
                return true;
            }
        }
        false
    });

    if let Some((slot_num, _)) = slot {
        player_slots[slot_num].status = status;
        return Ok(());
    }
    Err(anyhow!("Gamepad id not found"))
}

fn set_slot_by_id(
    id: &GamepadId,
    new_conn: &PlayerSlotConnection,
    state: State<'_, PlayerSlotState>,
) -> Result<(), Error> {
    let player_slots = &mut state.write().unwrap().0;
    let slot = player_slots.iter().enumerate().find(|(_, conn)| {
        if let Some(current_id) = conn.gamepad_id {
            if current_id == *id {
                return true;
            }
        }
        false
    });

    if let Some((slot_num, _)) = slot {
        player_slots[slot_num] = *new_conn;
        return Ok(());
    }
    Err(anyhow!("Gamepad id not found"))
}

#[tauri::command]
pub fn get_player_slot_states(state: State<'_, PlayerSlotState>) -> [PlayerSlotConnection; MAX_CONTROLLERS as usize] {
    state.read().unwrap().0
}

#[tauri::command]
pub fn swap_player_slots(state: State<'_, PlayerSlotState>, slot_num_1: usize, slot_num_2: usize) {
    let player_slots = &mut state.write().unwrap().0;
    player_slots.swap(slot_num_1, slot_num_2);
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
