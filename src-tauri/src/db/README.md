### Current setup docs (for mac)
```sh
brew install diesel # install diesel cli
```

### Create Database url for sqlite diesel

Create .env file with a database url like below
- Linux: DATABASE_URL=$XDG_DATA_HOME/coms-console or $HOME/.local/share/coms-console/local.db

- macOS: $HOME/Library/Application Support/coms-console/local.db

- Windows: $HOME\AppData\Roaming\coms-console/local.db
DATABASE_URL="/Users/mc/Library/Application Support/coms-console/local.db"
