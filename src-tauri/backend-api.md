# Backend Tauri Command API (MVP)

## get_game_info
This call to the tauri backend returns an array of js objects. The strict rust type definitions for each field are shown below:
```rs
struct GameInfo {
    id: Option<u64>, // this is an option rust-side due to the id's being generated outside of the description json
    title: String,
    file_path: Option<PathBuf>,
    author: String,
    summary: String,
    release_date: String,
    multiplayer: bool,
    genres: Vec<String>,
    cover_image: Option<PathBuf>,
    times_played: u128,
    last_played: Option<DateTime<Utc>>, // this is a utc timestamp eg. 1727149399
    exec: Option<PathBuf>,
}
```
Fields where the type is wrapped in an `Option<T>` means that the value is either passed as null or the type `T` within.

### Usage examples

#### Basic usage

```js
invoke('get_game_info').then(games => console.log(games))

// invoke returns a promise which resolves to an array of gameInfo objects

// example console.log output
[
    {
        "id": 1515381106465943800,
        "title": "Top Duck",
        "file_path": "../games/alleged-game",
        "author": "idk",
        "summary": "Watch numbers and letters move up and down on a screen or something.",
        "release_date": "2024-11-28",
        "multiplayer": false,
        "genres": [
            "Platformer",
            "Strategy",
            "First Person Shooter",
            "Survival"
        ],
        "cover_image": "/Users/user/COMS-Console/games/alleged-game/idk.webp",
        "times_played": 0,
        "last_played": 1727066638, // UTC timestamp
        "exec": "game.sh"
    },
    {
        "id": 9010881980712660000,
        "title": "COMS-Snake-Game",
        "file_path": "../games/snake-game",
        "author": "Person",
        "summary": "Imprint, the duck inspired snake game for the COMS console\nOn PC use the arrow keys to move\nSNES Controls: X-Up A-Right Y-Left B-Down\nHeavily inspired by this tutorial: https://www.youtube.com/watch?v=QFvqStqPCRU\nShoutout to Zoe for the assets",
        "release_date": "2024-4-20",
        "multiplayer": false,
        "genres": [
            "Platformer",
            "Strategy",
            "First Person Shooter",
            "Survival"
        ],
        "cover_image": "/Users/user/COMS-Console/games/snake-game/assets/bread_3.png",
        "times_played": 0,
        "last_played": 1727066638,
        "exec": "main.py"
    }
]
```
#### Convert images to src urls
```js
// usage with image conversion
import { convertFileSrc } from '@tauri-apps/api/tauri';

(async () => {
    let gamesList = await invoke('get_game_info')
    gamesList = gamesList.map(async gameInfo => {
        gameInfo.cover_image = await convertFileSrc(gameInfo.cover_image)
        return gameInfo
    })
    console.log(gamesList)

    // example output
    [
        {
            ...
            cover_image: "asset://localhost/%2FUsers%2Fuser%2FCOMS-Console%2Fgames%2Falleged-game%2Fidk.webp"
            ...
        }
    ]
})()

```

## play_game
Invoking play_game will spawn a child process of the executable file associated with the given game. An id needs to be passed to the backend. Currently does not return anything.

### Usage
```js
invoke("play_game", {id: "1515381106465943800"})
```