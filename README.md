
# COMS Console (aka. The QuackBox)

This repository hosts the software for the COMS Console, a Raspberry Pi-based project with a unique, duck-inspired design owned by the [Computing Organization for Multicultural Students](https://www.rit.edu/computing/coms/).


## Features

- Auto fullscreen on Raspberry Pi startup
- Displays a library of all custom-made games
  - Retrieves and manages all games from a game library directory (varies by OS)
- Cross platform


## Tech Stack

| Category        | Tool/Language | Icon                                                                 |
| --------------- | ------------- | -------------------------------------------------------------------- |
| **Frontend**    | React         | <img title="React" src="https://skillicons.dev/icons?i=react" />    |
|                 | JavaScript    | <img title="JavaScript" src="https://skillicons.dev/icons?i=js" /> |
| **Backend**     | Tauri         | <img title="Tauri" src="https://skillicons.dev/icons?i=tauri" />           |
|                 | Rust          | <img title="Rust" src="https://skillicons.dev/icons?i=rust" />            |
| **Build Tools** | Vite          | <img title="Vite" src="https://skillicons.dev/icons?i=vite" /> |



## Installation

### macOS

1. Install [Homebrew](https://brew.sh/)
2. Install Rust
    ```bash
    brew install rustup
    ```
3. Install nvm and the latest version of Node.js
    ```bash
    brew install nvm
    nvm install 'lts/*'
    nvm alias default 'lts/*'
    ```
4. Run the following commands in the `COMS-Console` directory:
    ```bash
    source ~/.bashrc
    ```
   1. Install Rust and the Tauri CLI
        ```bash
        rustup-init
        cargo install tauri-cli
        ```
   2. Fetch all of the `cargo` dependencies
        ```bash
        cd src-tauri
        cargo fetch
        ```
   3. Install all of the `package.json` dependencies in the `COMS-Console` directory
        ```bash
        cd ..
        npm install
        ```

### Windows

1. Install [Node.js](https://nodejs.org/en/download/package-manager)
2. Install [Rustup](https://www.rust-lang.org/tools/install)
3. Install [nvm](https://github.com/coreybutler/nvm-windows/releases)
4. Open a new terminal and run the following commands in the `COMS-Console` directory:

   1. Install the Tauri CLI
        ```bash
        cargo install tauri-cli
        ```
   2. Fetch all of the `cargo` dependencies
        ```bash
        cd src-tauri
        cargo fetch
        ```
   3. Install all of the `package.json` dependencies in the `COMS-Console` directory
        ```bash
        cd ..
        npm install
        ```

### Linux (Debian-based Systems)
1. Update the system package list
    ```bash
    sudo apt update
    ```
2. Install the required libraries and tools
    ```bash
    sudo apt install libwebkit2gtk-4.0-dev \ 
    build-essential \
    curl \
    wget \ 
    file \
    libssl-dev \ 
    libgtk-3-dev \ 
    libayatana-appindicator3-dev \
    librsvg2-dev
    ```
3. Install Rust
    ```bash
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    rustup-init
    ```
4. Install nvm and the latest version of Node.js
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
    source ~/.bashrc
    nvm install 'lts/*'
    nvm alias default 'lts/*'
    ```
5. Run the following commands in the `COMS-Console` directory:
    ```bash
    source ~/.bashrc
    ```
   1. Install the Tauri CLI
        ```bash
        cargo install tauri-cli
        ```
   2. Fetch all of the `cargo` dependencies
        ```bash
        cd src-tauri
        cargo fetch
        ```
   3. Install all of the `package.json` dependencies in the `COMS-Console` directory
        ```bash
        cd ..
        npm install
        ```
## Game Library Configuration

The Game Library stores all custom games accessible through the COMS Console. Upon running the application for the first time, a games folder will be automatically created in the user data directory.

If you have a zipped collection of games, unpack them into this folder to match the following structure:

```
coms-console
└── games
    ├── game1
    │   ├── <game source files>
    │   └── desc.json
    ├── game2
    │   ├── <game source files>
    │   └── desc.json
    ├── game3
    │   ├── <game source files>
    │   └── desc.json
    └── game4
        ├── <game source files>
        └── desc.json
```

Each game should reside in its own folder with the following components:

- `<game source files>`: All essential files for the game
- `desc.json`: Metadata file containing information about the game

### Default `games` Folder Locations
The games folder is located within the user’s application data directory, which varies by operating system:

- Linux: `$XDG_DATA_HOME/coms-console or $HOME/.local/share/coms-console`

- macOS: `$HOME/Library/Application Support/coms-console`

- Windows: `$HOME\AppData\Roaming\coms-console`

> Note: Make sure to extract the games directly into the games folder to ensure the application can locate and display them properly.
## Deployment

To deploy this project run

```bash
npm run tauri dev
```


## Optimizations

- Migrated frontend from [Create React App](https://create-react-app.dev/) to [Vite](https://vite.dev/) for improved performance and faster build times
- Cleaned up `package.json` by removing unnecessary dependencies
- Initialized a Tauri project to replace the previous Python backend, enhancing cross-platform compatibility
- Configured Vite to work seamlessly with Tauri
- Set Tauri to launch in fullscreen mode on startup for a better user experience


## Future Project Roadmap

### Hardware

- **Simplified Raspberry Pi Deployment:** Streamline the deployment process on Raspberri Pi to make it more user-friendly

### Backend
- **Automate Builds:** Implement GitHub Actions for automated builds

- **Frontend and Backend Communication:** Outline and document functions for communication between the frontend and backend

### Frontend

- **Auto-refocus Launcher:** Enable the application to automatically refocus the launcher after closing a game

- **TypeScript Migration:** Transition the frontend codebase from JavaScript to TypeScript to improve type safety

- **Dark Mode:** Introduce a dark mode option for user experience and accesibility

- **Expanded Controller Support:** Increase support for various game controllers to enhance accessibility and user engagement

- **Tauri Startup Plugin:** Integrate the Tauri startup plugin for better application startup management

- **QuackBox Design System:** Implement a QuackBox-specific design syste, to improve user interface and experience
## Feedback

If you have any feedback, feature requests, or comments, please reach out to us at [coms@rit.edu](mailto:coms@rit.edu).
