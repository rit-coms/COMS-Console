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

### Redoing migrations
```sh
# Run migrations to add all the tables to sqlite
diesel migration run

# Resets the database, rerunning all migrations
diesel database reset 

# Add new migration
diesel migration generate name-of-migration # creates a new sql migration
```

### Further Diesel Reference
- [Diesel.rs Getting Starting](https://diesel.rs/guides/getting-started)
- [Diesel.rs Guides](https://diesel.rs/guides/)
- [Diesel.rs API Docs](https://docs.diesel.rs/master/diesel/index.html)