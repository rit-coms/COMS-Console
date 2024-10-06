// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// use std::collections::HashMap;
use std::hash::{DefaultHasher, Hash, Hasher};
use std::io::BufReader;
use std::path::PathBuf;
use std::{env, fs};

use serde::{Deserialize, Serialize};
use serde_json;

use tauri::{AppHandle, Manager, State};

use chrono::serde::ts_seconds_option;
use chrono::{DateTime, Utc};

use std::process::Command;
use std::sync::Mutex;

use anyhow::Error;

#[derive(Deserialize, Serialize, Debug, Clone)]
#[serde(try_from = "GameInfoJS")]
#[serde(into = "GameInfoJS")]
struct GameInfo {
    id: u64,
    title: String,
    file_path: PathBuf,
    author: String,
    summary: String,
    release_date: String,
    multiplayer: bool,
    genres: Vec<String>,
    cover_image: Option<PathBuf>,
    times_played: u128,
    last_played: Option<DateTime<Utc>>,
    exec: PathBuf,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
struct GameInfoJS {
    #[serde(default)]
    id: String,
    title: String,
    #[serde(default)]
    file_path: PathBuf,
    author: String,
    summary: String,
    release_date: String,
    multiplayer: bool,
    genres: Vec<String>,
    cover_image: Option<PathBuf>,
    times_played: u128,
    #[serde(with = "ts_seconds_option")]
    last_played: Option<DateTime<Utc>>,
    exec: PathBuf,
}

impl From<GameInfo> for GameInfoJS {
    fn from(game_info: GameInfo) -> Self {
        GameInfoJS {
            id: game_info.id.to_string(),
            title: game_info.title,
            file_path: game_info.file_path,
            author: game_info.author,
            summary: game_info.summary,
            release_date: game_info.release_date,
            multiplayer: game_info.multiplayer,
            genres: game_info.genres,
            cover_image: game_info.cover_image,
            times_played: game_info.times_played,
            last_played: game_info.last_played,
            exec: game_info.exec,
        }
    }
}

impl TryFrom<GameInfoJS> for GameInfo {
    fn try_from(game_info_js: GameInfoJS) -> Result<GameInfo, Error> {
        Ok(GameInfo {
            id: game_info_js.id.parse::<u64>()?,
            title: game_info_js.title,
            file_path: game_info_js.file_path,
            author: game_info_js.author,
            summary: game_info_js.summary,
            release_date: game_info_js.release_date,
            multiplayer: game_info_js.multiplayer,
            genres: game_info_js.genres,
            cover_image: game_info_js.cover_image,
            times_played: game_info_js.times_played,
            last_played: game_info_js.last_played,
            exec: game_info_js.exec,
        })
    }

    type Error = Error;
}

#[derive(Default)]
struct AppState {
    games_list: Vec<GameInfo>,
}

#[derive(Serialize)]
#[serde(transparent)]
struct ErrorType(String);

impl<T: ToString> From<T> for ErrorType {
    fn from(t: T) -> ErrorType {
        ErrorType(t.to_string())
    }
}

// TODO: reimplement to handle errors and be smarter later
// currently takes in the games_list from Tauri's store
// and updates it by looking through the games folder
// and parsing through all the folders of games it finds
#[tauri::command]
fn get_game_info(
    state: State<'_, Mutex<AppState>>,
    app_handle: AppHandle,
) -> Result<Vec<GameInfo>, ErrorType> {
    let mut state = state.lock().unwrap();
    let games_list = &mut state.games_list;
    games_list.clear();

    // generating app data directory and games folder if it doesn't exist
    let app_data_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .ok_or("Could not find app data directory")?
        .join("games");
    println!("{:?}", app_data_dir);

    fs::create_dir_all(app_data_dir.clone())?;

    let entries = fs::read_dir(app_data_dir.clone())?;
    for entry in entries {
        let entry = entry?;
        let mut desc_path = entry.path();
        desc_path.push("desc.json");
        let desc_file = fs::File::open(desc_path.clone())?;
        let mut desc: GameInfo = serde_json::from_reader(BufReader::new(desc_file))?;

        // initialize file path
        let mut folder_path = desc_path.clone();
        folder_path.pop();
        desc.file_path = folder_path;

        // create and set hash id
        let mut hasher = DefaultHasher::new();
        desc.file_path.hash(&mut hasher);
        desc.id = hasher.finish();

        // set cover image from desc.json
        desc.cover_image = desc
            .cover_image
            .map(|cover_image: PathBuf| fs::canonicalize(desc.file_path.join(cover_image))).transpose()?;

        games_list.push(desc);
    }

    println!("{}", serde_json::to_string_pretty(games_list).unwrap());

    Ok(state.games_list.clone())
}

// run a game
#[tauri::command]
fn play_game(
    state: State<'_, Mutex<AppState>>,
    window: tauri::Window,
    id: String,
) -> Result<(), ErrorType> {
    let games_list = &state.lock()?.games_list;
    let path = env::current_dir()?;
    let id = id.parse::<u64>()?;
    let game_info = games_list
        .iter()
        .find(|g| g.id == id)
        .ok_or("Game ID not found")?;
    let path = path.join(&game_info.file_path).join(&game_info.exec);
    println!("{:#?}", path);
    window.minimize()?;
    let game_process = Command::new(path).output()?;

    println!("{}", String::from_utf8(game_process.stdout)?);
    println!("{}", String::from_utf8(game_process.stderr)?);
    println!("exit code status: {}", game_process.status);
    window.maximize()?;
    window.set_focus()?;
    window.set_fullscreen(true)?;
    Ok(())
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
