# COMS Console Monorepo

## Requirements

- Nix (package manager): https://nixos.org/download/
  - Experimental flakes must be enabled: https://nixos.wiki/wiki/Flakes
- direnv (optional): https://direnv.net/docs/installation.html
- nix-direnv (optional): https://github.com/nix-community/nix-direnv#installation

## In-Depth Dev Setup Guide

[WIP]()

## Directory Structure

```text
.
|-- flake.nix
|-- package.json
|-- README.md
|-- tsconfig.json
|-- apps/
|   `-- quackbox/
|       |-- CONTRIBUTE.md
|       |-- index.html
|       |-- LICENSE
|       |-- package.json
|       |-- pnpm-lock.yaml
|       |-- README.md
|       |-- tsconfig.json
|       |-- vite.config.ts
|       |-- src/
|       |   |-- App.jsx
|       |   |-- index.css
|       |   |-- index.jsx
|       |   |-- README.md
|       |   |-- assets/
|       |   |   `-- videos/
|       |   |-- components/
|       |   |   |-- FilterModal.jsx
|       |   |   |-- Footer.jsx
|       |   |   |-- GameGallery.jsx
|       |   |   |-- GameInfoModal.jsx
|       |   |   |-- Navigation.jsx
|       |   |   `-- SearchModal.jsx
|       |   |-- context/
|       |   |   |-- contexts.jsx
|       |   |   |-- GamepadContext.jsx
|       |   |   |-- Keybinds.md
|       |   |   |-- NavigationContext.jsx
|       |   |   |-- PageContext.jsx
|       |   |   `-- ToastContext.jsx
|       |   |-- hooks/
|       |   |   `-- useModal.ts
|       |   |-- pages/
|       |   |   |-- ControllerConnectPage.jsx
|       |   |   |-- HomePage.jsx
|       |   |   `-- LandingPage.jsx
|       |   `-- styles/
|       |       |-- FilterModal.css
|       |       |-- Footer.css
|       |       |-- GameGallery.css
|       |       |-- GameInfoModal.css
|       |       |-- HomePage.css
|       |       |-- Navigation.css
|       |       `-- SearchModal.css
|       |-- src-tauri/
|       |   |-- backend-api.md
|       |   |-- build.rs
|       |   |-- Cargo.toml
|       |   |-- diesel.toml
|       |   |-- tauri.conf.json
|       |   |-- capabilities/
|       |   |   |-- desktop.json
|       |   |   `-- migrated.json
|       |   |-- gen/
|       |   |   `-- schemas/
|       |   |       `-- ...
|       |   |-- icons/
|       |   |-- migrations/
|       |   |   |-- 2025-02-21-043342_create_leaderboard/
|       |   |   |-- 2025-02-21-211725_create_users/
|       |   |   |-- 2025-02-21-211832_create_saves/
|       |   |   `-- 2025-02-21-213304_create_games/
|       |   |-- src/
|       |   |   |-- lib.rs
|       |   |   |-- main.rs
|       |   |   |-- db/
|       |   |   |-- frontend_api/
|       |   |   `-- game_dev_api/
|       |   |-- target/
|       |   |   |-- CACHEDIR.TAG
|       |   |   `-- debug/
|       |   `-- tests/
|       |       `-- integration_tests.rs
|       `-- tooling/
|           `-- shell.nix
|-- libs/
|   `-- quackbox-design-system/
|       |-- eslint.config.js
|       |-- LICENSE
|       |-- package.json
|       |-- README.md
|       |-- tsconfig.app.json
|       |-- tsconfig.json
|       |-- tsconfig.node.json
|       |-- vite.config.ts
|       |-- public/
|       |   `-- assets/
|       `-- src/
|           |-- global.d.ts
|           |-- index.ts
|           |-- components/
|           |   |-- Action Button/
|           |   |-- Alert/
|           |   |-- Button/
|           |   |-- Button Group/
|           |   |-- Caret/
|           |   |-- Carousel/
|           |   |-- Checkbox/
|           |   |-- Checkbox Group/
|           |   |-- Close Button/
|           |   |-- Container/
|           |   |-- Game/
|           |   |-- Icon/
|           |   |-- Icon Button/
|           |   |-- Keyboard/
|           |   |-- Link/
|           |   |-- Logo/
|           |   |-- Modal/
|           |   |-- Pill/
|           |   |-- Player Tile/
|           |   |-- PlayerContainer/
|           |   |-- Radio/
|           |   |-- Radio Group/
|           |   |-- Search/
|           |   |-- Table/
|           |   |-- Tabs/
|           |   |-- Toast/
|           |   `-- Typography/
|           |-- styles/
|           |   `-- globals.css
|           `-- types/
|               |-- base.ts
|               |-- index.ts
|               `-- types.ts
`-- tooling/
    `-- shell.nix
```

## Tooling Explanation

This project uses Nix for development environments and CI/CD, and Bun for JavaScript package and script management.

### Nix Commands

| Command | Description | Notes |
| --- | --- | --- |
| `nix develop .#quackbox` | Loads dependencies for working on the Quackbox launcher. | Automatically activates when working in `apps/quackbox` (if direnv is configured). |
| `nix develop .` | Loads global environment dependencies for the monorepo. | Useful from the repo root. |
| `nix test` | Runs Nix-based tests. | WIP |
| `nix build` | Builds using Nix definitions. | WIP |

### Bun Commands

| Command | Description |
| --- | --- |
| `bun install` | Installs dependencies for all projects in the monorepo. |
| `bun list` | Lists installed Bun dependencies across JavaScript subprojects. |
| `bun run --filter quackbox dev` | Runs only the Quackbox frontend. |
| `bun run --filter quackbox tauri dev` | Runs the Quackbox launcher (Tauri + frontend). |
| `bun run --filter @coms-console/quackbox-design-system storybook` | Runs Storybook for the design system. |
| `bun run --filter @coms-console/quackbox-design-system build` | Builds the design system package for launcher UI usage. |
