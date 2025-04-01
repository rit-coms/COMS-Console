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
- Linux: DATABASE_URL=$XDG_DATA_HOME/coms-console or $HOME/.local/share/coms-console/local.db

- macOS: $HOME/Library/Application Support/coms-console/local.db

- Windows: $HOME\AppData\Roaming\coms-console/local.db

DATABASE_URL="/Users/mc/Library/Application Support/coms-console/local.db"

### Redoing migrations
```sh
# Run migrations to add all the tables to sqlite
diesel migration run

# Undo all migrations
diesel migration undo
diesel migration undo
diesel migration undo
diesel migration undo
diesel migration undo

# Add new migration
diesel migration generate name-of-migration
```
