# How to Contribute
If you're interested in helping add features or want to work on the console software, check out the [github issues](https://github.com/rit-coms/COMS-Console/issues). Below is a guide to how to setup your environment for development of the Quackbox software.

If you're interested in learning more about the structure of the frontend, take a look at the [frontend reference](src/README.md).

The backend is mostly undocumented, though some functions are documented using rust docstrings. To generate docs, navigate to the src-tauri directory and run `cargo doc --open`. That command will run and generate the current documentation on any declared modules.

## Developer Setup
> [!NOTE]
> It's not necessary to install Homebrew or nvm, but it's highly recommended to install this way if it's your first time using these tools. These package managers will help differentiate dependency versions in between other projects.
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
    sudo apt install libwebkit2gtk-4.0-dev \  # this will be deprecated in the future
    libwebkit2gtk-4.1-dev \
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

## Database Setup
In the developer debug version, sqlite migration tables aren't automatically embedded. That means that you have to setup the sqlite database. We're using [diesel.rs](https://diesel.rs/) for the interfacing with the sqlite database from rust.

### Diesel CLI Install
Windows:
```pwsh
# Windows (powershell)
Set-ExecutionPolicy RemoteSigned -scope CurrentUser
irm https://github.com/diesel-rs/diesel/releases/latest/download/diesel_cli-installer.ps1 | iex
```
Linux:
```sh
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/diesel-rs/diesel/releases/latest/download/diesel_cli-installer.sh | sh
```
Mac:
```sh
brew install diesel # install diesel cli
```

Alternative install with cargo:
```sh
cargo binstall diesel_cli
```

### Create Database url for sqlite diesel
If you want to setup the database file where the normal application is, use the following paths.
Otherwise, you can specify somewhere that won't affect the compiled application path.
Create .env file with a database url like below
- Linux: 
  - DATABASE_URL=$XDG_DATA_HOME/coms-console
  - DATABASE_URL=$HOME/.local/share/coms-console/local.db (recommended)

- macOS: 
  - DATABASE_URL=$HOME/Library/Application\ Support/coms-console/local.db

- Windows: 
  - DATABASE_URL=%UserProfile%\AppData\Roaming\coms-console/local.db
  - (the above is untested on windows)

### Redoing migrations (If the migrations tables change)
```sh
# Run migrations to add all the tables to sqlite
diesel migration run

# Resets the database, rerunning all migrations
diesel database reset 

# Add new migration
diesel migration generate name-of-migration # creates a new sql migration
```


## Development & Building

To startup this project's development server run

```bash
# In top level of repository
npm run tauri dev
```

To build the release versione of the project for your current platform

```bash
# In top level of repository
npm run tauri build
```

To build this project for the QuackBox

```bash
# In top level of repository
npm run tauri build -- --features quackbox-raspi
```