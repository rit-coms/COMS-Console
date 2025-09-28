use crate::db::get_username;
use crate::db::{get_leaderboard, get_leaderboard_game_data, insert_game};
use anyhow::Error;
use chrono::{serde::ts_seconds_option, DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::{
    collections::HashMap,
    env,
    fs::{self, File},
    hash::{DefaultHasher, Hash, Hasher},
    io::BufReader,
    path::PathBuf,
    process::Command,
    sync::RwLock,
    sync::Arc,
};
use tauri::{AppHandle, Listener, Manager, State};
use tokio::sync::{oneshot, watch::Sender, Mutex, Notify};
use url::Url;

use crate::db;

#[derive(Deserialize, Serialize, Debug, Clone)]
#[serde(try_from = "GameInfoJS")]
#[serde(into = "GameInfoJS")]
pub struct GameInfo {
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
    exec: String,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
struct GameInfoJS {
    #[serde(default = "id_default")]
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
    exec: String,
}

fn id_default() -> String {
    "0".to_string()
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
pub struct AppState {
    games_list: Vec<GameInfo>,
    db_path: String,
}

impl AppState {
    pub fn new(db_path: String) -> Self {
        AppState {
            games_list: Vec::new(),
            db_path,
        }
    }
}

#[derive(Default)]
pub struct LoadedGamesInner {
    games_list: Vec<GameInfo>,
    db_path: String,
}

pub type LoadedGamesState = RwLock<LoadedGamesInner>;

pub struct GameSenderState {
    pub notifier: Arc<Notify>,
    pub game_watch_tx: Sender<Option<u64>>,
}

#[derive(Serialize, Debug)]
#[serde(transparent)]
pub struct ErrorType(String);

impl<T: ToString> From<T> for ErrorType {
    fn from(t: T) -> ErrorType {
        ErrorType(t.to_string())
    }
}

/// Retrieves the game information from the games folder and updates the application's state.
///
/// This command scans the games folder in the app data directory, reads the `game-metadata.json`
/// files for each game, and updates the `games_list` in the application's state.
///
/// # Arguments
///
/// * `state` - A reference to the application's state containing the list of games.
/// * `app_handle` - A handle to the Tauri application.
///
/// # Returns
///
/// * `Result<Vec<GameInfo>, ErrorType>` - A list of `GameInfo` structs representing the games,
///   or an `ErrorType` if an error occurs.
///
/// # Errors
///
/// This function will return an error if:
/// * The app data directory cannot be found.
/// * The games folder cannot be created.
/// * The `game-metadata.json` file cannot be read or parsed.
/// * The cover image path cannot be canonicalized.
///
/// # Example (Frontend)
///
/// ```javascript
/// import { invoke } from '@tauri-apps/api/tauri';
/// import { convertFileSrc } from '@tauri-apps/api/tauri';
///
/// async function fetchGameInfo() {
///   try {
///     let games = await invoke('get_game_info');
///     games = await Promise.all(games.map(async (gameInfo) => {
///       gameInfo.cover_image = await convertFileSrc(gameInfo.cover_image);
///       return gameInfo;
///     }));
///     console.log('Games:', games);
///   } catch (error) {
///     console.error('Error fetching game info:', error);
///   }
/// }
///
/// fetchGameInfo();
/// ```
async fn get_game_info_list(
    state: &State<'_, Mutex<AppState>>,
    app_handle: &AppHandle,
) -> Result<Vec<GameInfo>, ErrorType> {
    let mut state = state.lock().await;
    let games_list = &mut state.games_list;
    games_list.clear();

    // generating app data directory and games folder if it doesn't exist
    let app_data_dir = app_handle.path().app_data_dir()?.join("games");

    println!("{:?}", app_data_dir);

    fs::create_dir_all(app_data_dir.clone())?;

    let entries = fs::read_dir(app_data_dir.clone())?;
    for entry in entries {
        let entry = entry?;
        let mut game_metadata_path = entry.path();
        game_metadata_path.push("game-metadata.json");

        // checks to see if game_metadata.json exists
        if !game_metadata_path.exists() {
            continue;
        }

        // get game_metadata_file
        let game_metadata_file = fs::File::open(game_metadata_path.clone())?;

        let game_metadata: Result<GameInfo, serde_json::Error> =
            serde_json::from_reader(BufReader::new(game_metadata_file));

        if let Err(err) = game_metadata {
            println!("Failed at {:#?}", game_metadata_path);
            match err.classify() {
                serde_json::error::Category::Io => println!("Failed to read json"),
                serde_json::error::Category::Syntax => println!("JSON is not syntactically valid"),
                serde_json::error::Category::Data => {
                    println!("JSON data is not semantically correct")
                }
                serde_json::error::Category::Eof => {
                    println!("Prematurely reached end of JSON file")
                }
            }
            continue;
        }

        let mut game_metadata = game_metadata?;

        // initialize file path
        let mut folder_path = game_metadata_path.clone();
        folder_path.pop();
        game_metadata.file_path = folder_path;

        // create and set hash id
        let mut hasher = DefaultHasher::new();
        game_metadata.file_path.hash(&mut hasher);
        game_metadata.id = hasher.finish();

        // convert to full uncanonicalized file path
        game_metadata.cover_image = game_metadata
            .cover_image
            .map(|cover_image| game_metadata.file_path.join(&cover_image));

        // check if file path exists and has an image extension
        game_metadata.cover_image = game_metadata.cover_image.filter(|cover_image| {
            cover_image
                .extension()
                .is_some_and(|ext| ["png", "jpg", "webp"].map(|s| s.as_ref()).contains(&ext))
                && cover_image.exists()
        });

        // set cover image to the canonicalized path if it exists
        game_metadata.cover_image = game_metadata
            .cover_image
            .map(|cover_image: PathBuf| {
                println!("{:?}", &cover_image);
                fs::canonicalize(&cover_image)
            })
            .transpose()?;

        games_list.push(game_metadata);
    }

    println!("{}", serde_json::to_string_pretty(games_list).unwrap());

    Ok(state.games_list.clone())
}

#[derive(Deserialize)]
struct GameDataList {
    games: Vec<GameData>,
}

#[derive(Deserialize)]
struct GameData {
    title: String,
    id: String,
}

/// Make sure every game listed in the games\all-games.json file is in the local database
fn check_all_games(app_handle: &AppHandle) {
    // getting the app data directory
    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .expect("Could not find app data directory");

    // Getting the list of games within the all-games JSON file
    let all_games_file_path = app_data_dir.join("games/all-games.json");
    let all_games_file = File::open(&all_games_file_path).expect(
        format!(
            "all-games.json not found at {}",
            &all_games_file_path.clone().display()
        )
        .as_str(),
    );
    let reader = BufReader::new(all_games_file);
    // If this reading is ever too slow, we can switch to reading the file into memory as a string
    // and then converting that string into a JSON Value
    let games_list: GameDataList =
        serde_json::from_reader(reader).expect("Failed to read all-games.json");

    for game in games_list.games {
        db::make_sure_game_exists(
            &game.title,
            &game.id,
            app_handle
                .path()
                .app_data_dir()
                .unwrap()
                .join("local")
                .with_extension("db")
                .into_os_string()
                .to_str()
                .unwrap(),
        );
    }
}

// Given a list of games, set them to be installed in the database
fn set_games_installed(games: &Vec<GameInfo>, app_handle: &AppHandle) {
    for game in games {
        db::insert_game(
            &game.id.to_string(),
            &game.title,
            true,
            app_handle
                .path()
                .app_data_dir()
                .unwrap()
                .join("local")
                .with_extension("db")
                .into_os_string()
                .to_str()
                .unwrap(),
        );
    }
}

#[tauri::command]
pub async fn get_game_info(
    state: State<'_, Mutex<AppState>>,
    app_handle: AppHandle,
) -> Result<Vec<GameInfo>, ErrorType> {
    let games = get_game_info_list(&state, &app_handle).await?;
    set_games_installed(&games, &app_handle);
    // Only populate the database with all games if code is running on the quackbox
    if cfg!(feature = "quackbox-raspi") {
        check_all_games(&app_handle);
    }
    Ok(games)
}

#[derive(Serialize, Debug)]
struct FrontendLeaderboardEntry {
    value_num: f64,
    username: String,
    time_stamp: String,
}

/// Retrieves a json object of all leaderboard data for a given game.
///
/// # Arguments
/// `game_title` - The title of the game to get data for (case sensitive)
///
///
/// # Returns
/// * `Result<serde_json::Value, ErrorType>` - A JSON object representing the leaderboard data of a
/// specific game or an `ErrorType` if an error occurs.
#[tauri::command]
pub async fn get_leaderboard_data(
    game_title: String,
    state: State<'_, Mutex<AppState>>,
) -> Result<serde_json::Value, ErrorType> {
    get_leaderboard_data_helper(game_title, state.lock().await.db_path.as_str())
}

/// This function allows us to mock databases for testing without having a db_name parameter
/// at the front end
fn get_leaderboard_data_helper(
    game_title: String,
    db_name: &str,
) -> Result<serde_json::Value, ErrorType> {
    let data = get_leaderboard_game_data(&game_title, db_name)?;

    let mut sorted_data: HashMap<String, Vec<FrontendLeaderboardEntry>> = HashMap::new();
    for entry in data {
        match sorted_data.get_mut(&entry.value_name) {
            Some(entries) => entries.push(FrontendLeaderboardEntry {
                value_num: entry.value_num,
                username: get_username(&entry.user_id, db_name)?,
                time_stamp: entry.time_stamp,
            }),
            None => {
                sorted_data.insert(
                    entry.value_name,
                    vec![FrontendLeaderboardEntry {
                        value_num: entry.value_num,
                        username: get_username(&entry.user_id, db_name)?,
                        time_stamp: entry.time_stamp,
                    }],
                );
            }
        }
    }

    Ok(serde_json::json!({
        "title": game_title,
        "data": sorted_data
    }))
}

/// Runs a game based on its ID.
///
/// This command finds the game with the specified ID in the `games_list`, minimizes the current window,
/// and either opens a new window with the game's URL or runs the game's executable file.
///
/// # Arguments
///
/// * `state` - A reference to the application's state containing the list of games.
/// * `window` - A reference to the current Tauri window.
/// * `app_handle` - A handle to the Tauri application.
/// * `id` - The ID of the game to be played.
///
/// # Returns
///
/// * `Result<(), ErrorType>` - An empty result indicating success, or an `ErrorType` if an error occurs.
///
/// # Errors
///
/// This function will return an error if:
/// * The game ID is not found in the `games_list`.
/// * The current directory cannot be accessed.
/// * The game executable path does not exist.
/// * The game process cannot be started.
///
/// # Example (Frontend)
///
/// ```javascript
/// import { invoke } from '@tauri-apps/api/tauri';
///
/// async function startGame(gameId) {
///   try {
///     await invoke('play_game', { id: gameId });
///     console.log('Game started successfully');
///   } catch (error) {
///     console.error('Error starting game:', error);
///   }
/// }
///
/// startGame('12345');
/// ```
#[tauri::command]
pub async fn play_game(
    state: State<'_, Mutex<AppState>>,
    game_sender_state: State<'_, GameSenderState>,
    window: tauri::Window,
    app_handle: AppHandle,
    id: String,
) -> Result<(), ErrorType> {
    let games_list = &state.lock().await.games_list;
    let path = env::current_dir()?;
    let id = id.parse::<u64>()?;
    let game_info = games_list
        .iter()
        .find(|g| g.id == id)
        .ok_or("Game ID not found")?;
    game_sender_state.game_watch_tx.send(Some(id))?;
    println!("sending id: {}", id);
    game_sender_state.notifier.notified().await;
    println!("Recieved notification, starting game");

    window.minimize()?;

    let exec_url = Url::parse(&game_info.exec);

    println!("{:#?}", exec_url);

    // check if exec_url is using http or https protocols and is valid
    match exec_url
        .ok()
        .filter(|url| ["http", "https"].contains(&url.scheme()))
    {
        // create new game window
        Some(exec_url) => {
            let game_window = tauri::WebviewWindowBuilder::new(
                &app_handle,
                "external",
                tauri::WebviewUrl::External(exec_url),
            )
            .build()?;

            game_window.maximize()?;
            game_window.set_focus()?;
            game_window.set_fullscreen(true)?;
            wait_for_window_close(game_window).await;
        }
        None => {
            let path = path.join(&game_info.file_path).join(&game_info.exec);

            // check if exec path exists
            if path.try_exists()? == false {
                return Err("Exec path does not exist")?;
            }
            println!("{:#?}", path);

            let game_process = Command::new(path)
                .current_dir(&game_info.file_path)
                .output()?;

            println!("{}", String::from_utf8(game_process.stdout)?);
            println!("{}", String::from_utf8(game_process.stderr)?);
            println!("exit code status: {}", game_process.status);
        }
    }

    game_sender_state.game_watch_tx.send(None)?;
    window.maximize()?;
    window.set_focus()?;
    window.set_fullscreen(true)?;
    game_sender_state.notifier.notified().await;
    println!("Recieved notification, game closed");
    Ok(())
}

async fn wait_for_window_close(window: tauri::WebviewWindow) {
    let (tx, rx) = oneshot::channel();

    // Listen for the window close event
    window.once("tauri://close-requested", move |_| {
        let _ = tx.send(());
    });

    // Wait for the close event
    let _ = rx.await;
}

mod tests {
    use super::*;
    use crate::db::test_context::{setup_initial_data, TestContext};

    #[tokio::test]
    async fn test_get_leaderboard_data() {
        let context = TestContext::new("test_get_leaderboard_data_frontend").await;
        setup_initial_data(context.get_db_path()).await;

        let data = get_leaderboard_data_helper("game0".to_string(), context.get_db_path())
            .expect("Failed to get leaderboard data");

        println!("{:?}", data);
    }
}
