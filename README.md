# README (Please read)

Hey y'all. This is the repo for the software side of the COMS Console, a raspberry pi based project with a duck-tastic exterior. The software stack being used here is tauri + react. 

## Key Functionalities

* Launch on pi startup
* Show splash / loading page
* Show controller connecting screen
* Show game library of all custom made games
    * Get all gammes from a directory
* Have search functionality for games

#### Changes from original version (create-react-app + python webserver) to (vite + tauri)

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

Then in a terminal within the COMS-console directory:
```bash
    rustup-init

    cargo install tauri-cli

    cd src/tauri

    cargo fetch

    cd ..

    npm i

    cargo run dev
```

Still wip whether or not this totally works, but try it and let someone on the project know if it doesn't work for you

### Windows

Todo (Gimme test subjects)

### Linux

Todo

## TODO

### Minimum Viable Product (MVB)

* ~~Write readme for how to install and run the project~~
    * Run-it-back for windows & linux
* Reimplement backend based off of old backend
    * Implement change from reading data.json to automatically reading a directory full of folders where each folder is a game that has information within that folder (eg. desc.txt, cover.*, exec.sh?)

### Future TODO

* Write Github actions for automatic builds
* Come up with list of functionalities for backend and frontend
    * Write list of functions that frontend and backend need for communication
* Auto refocus launcher after game closed
* Rewrite frontend in typescript
* Add dark mode
* Add more controller support
* Create systemd script for project
* Compile to .deb for easy systemd script installs
    * Make it possible to run on any pi easily