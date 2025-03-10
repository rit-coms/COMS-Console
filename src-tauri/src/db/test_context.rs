use std::fs::remove_file;

use crate::db::{establish_connection, get_db_path};
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
use dotenvy::dotenv;

const MIGRATIONS: EmbeddedMigrations = embed_migrations!("migrations/");

/// This struct is to be used for setting up and automatically deleting database instances for testing
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
