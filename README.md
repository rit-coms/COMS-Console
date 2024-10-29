# README (Please read)

Hey y'all. This is the repo for the software side of the COMS Console, a raspberry pi based project with a duck-tastic exterior. The software stack being used here is tauri + react. 

## Key Functionalities

* Launch on pi startup
* Show splash / loading page
* Show controller connecting screen
* Show game library of all custom made games
    * Get all games from a directory
        * Create and manage default game library directory within user's data directory (different between os's)
* Have search functionality for games

### Changes from original version (create-react-app + python webserver) to (vite + tauri)

* Changed frontend project folder from create-react-app to vite based
* Updated and cleaned up package.json to get rid of extraneous dependencies
* Initiated Tauri project to replace former python backend
    * configured Vite for Tauri
    * configured Tauri to fullscreen immediately
* Overwrote README.md


## How to run and install

### Mac

GET BREW (if you do not have it already) [brew.sh](https://brew.sh)

Install rustup `brew install rustup`
Install nvm `brew install nvm`
Install rustup `brew install rustup`

Then in a terminal within the COMS-console directory:
```bash
    source ~/.bashrc

    nvm install 'lts/*'

    nvm alias default 'lts/*'

    rustup-init

    cargo install tauri-cli

    cd src-tauri

    cargo fetch

    cd ..

    npm i

    npm run tauri dev
```

Still wip whether or not this totally works, but try it and let someone on the project know if it doesn't work for you

### Windows

Todo (Gimme test subjects)

### Linux (primed for pi debian users)

Start by installing a bunch of dependencies that are needed for building and rendering the tauri app.
```bash
sudo apt update
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

Install rustup 
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

rustup-init
```

Install nodejs (recommended install using nvm)
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

source ~/.bashrc

nvm install 'lts/*'

nvm alias default 'lts/*'
```

Then in a terminal within the COMS-console directory:
```bash
# you might need to start a new terminal or source your environment path

cargo install tauri-cli

cd src-tauri

cargo fetch

cd ..

npm i

npm run tauri dev
```

~~As the initial code was written on a mac, you might get a weird error with an npm package called `@rollup`. If that happens, delete the `package-lock.json` file and run `npm i` again. It should start working.~~

### Setup games folder

Once you run the application one, the games folder should be created. If you have the games zip, unpack all the files into the games folder so the structure looks something like
```sh
coms-console
    games
        game1
            ~gamefiles~
            desc.json
        game2
            ~gamefiles~
            desc.json
        game3
            ~gamefiles~
            desc.json
        game4
            ~gamefiles~
            desc.json
```
These are the folder locations for the following systems
* Linux: `$XDG_DATA_HOME/coms-console` or `$HOME/.local/share/coms-console`.
* macOS: `$HOME/Library/Application Support/coms-console`.
* Windows: `$HOME\AppData\Roaming\coms-console`

## TODO

### Minimum Viable Product (MVB)

* ~~Write readme for how to install and run the project~~
    * Run-it-back for windows & ~~linux~~
* ~~Reimplement backend based off of old backend~~
    * ~~Implement change from reading data.json to automatically reading a directory full of folders where each folder is a game that has information within that folder (eg. desc.txt, cover.*, exec.sh?)~~

### Future TODO

* ~~Write Github actions for automatic builds~~
* ~~Come up with list of functionalities for backend and frontend~~
    * ~~Write list of functions that frontend and backend need for communication~~
* Auto refocus launcher after game closed
* Rewrite frontend in typescript
* Add dark mode
* Add more controller support
* Use tauri startup plugin
    * Make it possible to run on any pi easily