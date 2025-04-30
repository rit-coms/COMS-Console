# COMS Console (aka. The QuackBox)

This repository hosts the software for the COMS Console, a Raspberry Pi-based project with a unique, duck-inspired design owned by the [Computing Organization for Multicultural Students](https://www.rit.edu/computing/coms/).

## Features
- 🖥️ Window management of game launcher
  - Manages game and launcher screen real estate
- 🎮 Displays a library of all custom-made games
  - 📂 Retrieves and manages all games from a game library directory (varies by OS)
  - 🛠️ Supports multiple game-making platforms (and in the process of adding more!)
    - 🐍 Pygame
    - 🎲 Godot
    - 🌐 Web Games (No Dev API Support)
- 🛠️ Game developer libraries for Quackbox console integration
  - 🏆 Support for Leaderboard entries and Save Data
- 🌍 Cross-platform support
- 🤖 Automated CI + CD builds for the Raspberry Pi, Mac, Windows, and Debian Linux


## Tech Stack

| Category        | Tool/Language | Icon                                                                 |
| --------------- | ------------- | -------------------------------------------------------------------- |
| **Frontend**    | React         | <img title="React" src="https://skillicons.dev/icons?i=react" />    |
|                 | JavaScript    | <img title="JavaScript" src="https://skillicons.dev/icons?i=js" /> |
| **Backend**     | Tauri         | <img title="Tauri" src="https://skillicons.dev/icons?i=tauri" />           |
|                 | Rust          | <img title="Rust" src="https://skillicons.dev/icons?i=rust" />            |
|                 | Sqlite        | <img title="Sqlite" src="https://skillicons.dev/icons?i=sqlite" /> |
| **Build Tools** | Vite          | <img title="Vite" src="https://skillicons.dev/icons?i=vite" /> |


## Installation
Check [releases](https://github.com/rit-coms/COMS-Console/releases/latest) for the latest packaged version!

## Game Library Configuration (For Game Developers)

The Game Library stores all custom games accessible through the COMS Console. Upon running the application for the first time, a games folder will be automatically created in the user data directory.

If you have a zipped collection of games, unpack them into this folder to match the following structure:

```
coms-console
└── games
    ├── all-games.json
    ├── game1
    │   ├── <game source files>
    │   └── game-metadata.json
    ├── game2
    │   ├── <game source files>
    │   └── game-metadata.json
    ├── game3
    │   ├── <game source files>
    │   └── game-metadata.json
    └── game4
        ├── <game source files>
        └── game-metadata.json
```

Each game should reside in its own folder with the following components:

- `<game source files>`: All essential files for the game
- `game-metadata.json`: Metadata file containing information about the game 
- `all-games.json`: A file containing all the games currently on the Quackbox. The ids in this file are used for the leaderboard saves

### Default `games` Folder Locations
The games folder is located within the user’s application data directory, which varies by operating system:

- Linux: `$XDG_DATA_HOME/coms-console or $HOME/.local/share/coms-console`

- macOS: `$HOME/Library/Application Support/coms-console`

- Windows: `$HOME\AppData\Roaming\coms-console`

> [!NOTE]
> Make sure to extract the games directly into the games folder to ensure the application can locate and display them properly.

## Development
Checkout the [developer setup guide](CONTRIBUTE.md) if you're interested in contributing.

## Changelog Summary
### Changes for v0.1.0

- Migrated frontend from [Create React App](https://create-react-app.dev/) to [Vite](https://vite.dev/) for improved performance and faster build times
- Cleaned up `package.json` by removing unnecessary dependencies
- Initialized a Tauri project to replace the previous Python backend, incurring less overhead during IPC and giving more control over window management
- Configured Vite to work seamlessly with Tauri
- Set Tauri to launch in fullscreen mode on startup for a better user experience
- Introduced error handling for file system access that propagates to the front end

## Changes for v1.0.0

- Added a http web server to handle leaderboard and save data requests made locally to port 6174
- Added a sqlite database to store user and game data
- Reorganized structure of project to promote modularity
- Created integration tests to reduce introduction of bugs
- Introduced the [Quackbox Design System](https://github.com/rit-coms/quackbox-design-system) to improve user interface and experience
- Overhauled the controller connection and navigation systems
- Introduced CI using Github Actions and updated old CD pipelines


## Future Project Roadmap

### System Runtime

- **Simplified Raspberry Pi Deployment:** Streamline the deployment process on the Raspberry Pi to make it more user-friendly

- **Kiosk Mode:** Run with less overhead using a custom kiosk window manager like [cage](https://github.com/cage-kiosk/cage) (for pi only)

### Backend

- **Game Updating & Version Control** Integrate a system for downloading updated versions of games

- **Pause Menu Screen:** Implement a general overlay that communicates to the game to pause and give the options to quit out of a game

- **Global Controller Key Listening:** Listen for certain inputs from the controller globally to manage game runtimes

- **Tauri v2 Migration:** Transition the backend tauri api from v1 &rarr; v2 for easier IPC, further package compartmentalization, and more testing functionality

- **Unit Testing:** Create unit and integration tests to establish continous integration workflow

### Frontend

- **TypeScript Migration:** Transition the frontend codebase from JavaScript to TypeScript to improve type safety

- **Dark Mode:** Introduce a dark mode option for user experience and accesibility

- **Expanded Controller Support:** Increase support for various game controllers to enhance accessibility and user engagement

## Feedback

If you have any feedback, feature requests, or comments, please reach out to us at [coms@rit.edu](mailto:coms@rit.edu).

### License

This software is licensed under the [MIT License](LICENSE).
