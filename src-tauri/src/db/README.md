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
Create .env file with a database url like below
- Linux: 
  - DATABASE_URL=$XDG_DATA_HOME/coms-console
  - DATABASE_URL=$HOME/.local/share/coms-console/local.db (recommended)

- macOS: 
  - DATABASE_URL=$HOME/Library/Application\ Support/coms-console/local.db

- Windows: 
  - DATABASE_URL=%UserProfile%\AppData\Roaming\coms-console/local.db
  - (the above is untested on windows)

### Redoing migrations
```sh
# Run migrations to add all the tables to sqlite
diesel migration run

# Resets the database, rerunning all migrations
diesel database reset 

# Add new migration
diesel migration generate name-of-migration # creates a new sql migration
```
