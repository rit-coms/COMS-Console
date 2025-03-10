extern crate app;

use std::{env, fs::remove_file, path::Path};

use app::db::{establish_connection, get_db_path};
use app::game_dev_api::setup_game_dev_api;
use diesel::RunQueryDsl;
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
use dotenvy::dotenv;

const MIGRATIONS: EmbeddedMigrations = embed_migrations!("migrations/");

/// This struct is to be used for setting up integration tests for axum and diesel
pub struct TestContext {
    pub db_name: String,
}

impl TestContext {
    pub fn new(db_name: &str) -> Self {
        dotenv().expect("Make sure you have a .env in the project root directory");
        let mut connection = establish_connection(db_name);

        connection
            .run_pending_migrations(MIGRATIONS)
            .expect("Failed to run migrations");

        Self {
            db_name: db_name.to_owned(),
        }
    }
}

impl Drop for TestContext {
    fn drop(&mut self) {
        remove_file(get_db_path(&self.db_name));
    }
}
