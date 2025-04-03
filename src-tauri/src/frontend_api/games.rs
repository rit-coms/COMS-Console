use anyhow::Error;
use chrono::{serde::ts_seconds_option, DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::{
    env, fs,
    hash::{DefaultHasher, Hash, Hasher},
    io::BufReader,
    path::PathBuf,
    process::Command,
    sync::Mutex,
};
use tauri::{AppHandle, State};
use url::Url;

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
}

#[derive(Serialize)]
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
#[tauri::command]
pub fn get_game_info(
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
pub fn play_game(
    state: State<'_, Mutex<AppState>>,
    window: tauri::Window,
    app_handle: AppHandle,
    id: String,
) -> Result<(), ErrorType> {
    let games_list = &state.lock()?.games_list;
    let path = env::current_dir()?;
    let id = id.parse::<u64>()?;
    let game_info = games_list
        .iter()
        .find(|g| g.id == id)
        .ok_or("Game ID not found")?;

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
            let game_window = tauri::WindowBuilder::new(
                &app_handle,
                "external",
                tauri::WindowUrl::External(exec_url),
            )
            .build()?;

            game_window.maximize()?;
            game_window.set_focus()?;
            game_window.set_fullscreen(true)?;
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

    window.maximize()?;
    window.set_focus()?;
    window.set_fullscreen(true)?;
    Ok(())
}
