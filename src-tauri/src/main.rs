// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// use std::collections::HashMap;
use std::hash::{DefaultHasher, Hash, Hasher};
use std::io::BufReader;
use std::path::PathBuf;
use std::{env, fs};

use serde::{Deserialize, Serialize};
use serde_json::Error;

use tauri::{Manager, State, AppHandle};

use chrono::serde::ts_seconds_option;
use chrono::{DateTime, Utc};

use std::process::Command;
use std::sync::Mutex;

#[derive(Deserialize, Serialize, Debug, Clone)]
struct GameInfo {
    id: Option<String>,
    title: String,
    file_path: Option<PathBuf>,
    author: String,
    summary: String,
    release_date: String,
    multiplayer: bool,
    genres: Vec<String>,
    cover_image: Option<PathBuf>,
    times_played: u128,
    #[serde(with = "ts_seconds_option")]
    last_played: Option<DateTime<Utc>>,
    exec: Option<PathBuf>,
}

#[derive(Default)]
struct AppState {
    games_list: Vec<GameInfo>,
}

// TODO: reimplement to handle errors and be smarter later
// currently takes in the games_list from Tauri's store
// and updates it by looking through the games folder
// and parsing through all the folders of games it finds
#[tauri::command]
fn get_game_info(state: State<'_, Mutex<AppState>>, app_handle: AppHandle) -> Vec<GameInfo> {
    let mut state = state.lock().unwrap();
    let games_list = &mut state.games_list;
    games_list.clear();

    // generating app data directory and games folder if it doesn't exist
    let app_data_dir = app_handle.path_resolver().app_data_dir().unwrap().join("games");
    println!("{:?}", app_data_dir);
    
    unsafe {
        fs::create_dir_all(app_data_dir.clone()).unwrap_unchecked();
    }

    if let Ok(entries) = fs::read_dir(app_data_dir.clone()) {
        for entry in entries {
            if let Ok(entry) = entry {
                let mut desc_path = entry.path();
                desc_path.push("desc.json");
                if let Ok(desc_file) = fs::File::open(desc_path.clone()) {
                    let desc: Result<GameInfo, Error> =
                        serde_json::from_reader(BufReader::new(desc_file));
                    if let Ok(mut desc) = desc {
                        // initialize file path
                        let mut folder_path = desc_path.clone();
                        folder_path.pop();
                        desc.file_path = Some(folder_path);

                        // create and set hash id
                        let mut hasher = DefaultHasher::new();
                        desc.file_path.hash(&mut hasher);
                        desc.id = Some(hasher.finish().to_string());

                        // set cover image from desc.json
                        desc.cover_image = fs::canonicalize(
                            desc.file_path
                                .clone()
                                .unwrap()
                                .join(desc.cover_image.clone().unwrap()),
                        )
                        .ok();
                        games_list.push(desc);
                    }
                }
            }
        }
    }

    println!("{}", serde_json::to_string_pretty(games_list).unwrap());

    state.games_list.clone()
}

// run a game
#[tauri::command]
fn play_game(state: State<'_, Mutex<AppState>>, window: tauri::Window, id: String) {
    let games_list = &state.lock().unwrap().games_list;
    let path = env::current_dir().unwrap();
    let game_info = games_list
        .iter()
        .find(|g| g.id.clone().unwrap().parse::<u64>().unwrap() == id.parse::<u64>().unwrap())
        .unwrap();
    let path = path
        .join(game_info.file_path.as_ref().unwrap())
        .join(game_info.exec.as_ref().unwrap());
    println!("{:#?}", path);
    window.minimize().expect("failed to minimize");
    let game_process = Command::new(path)
        .output()
        .expect("execution of child failed");

    println!("{}", String::from_utf8(game_process.stdout).unwrap());
    println!("{}", String::from_utf8(game_process.stderr).unwrap());
    println!("exit code status: {}", game_process.status);
    window.maximize().expect("failed to maximize");
    window.set_focus().expect("failed to focus");
    window.set_fullscreen(true).expect("failed to fullscreen");
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            app.manage(Mutex::new(AppState::default()));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_game_info, play_game])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
