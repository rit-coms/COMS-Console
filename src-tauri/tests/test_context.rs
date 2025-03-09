extern crate app;

use std::{env, path::Path};

use app::db::establish_connection;
use app::game_dev_api::setup_game_dev_api;
use diesel::RunQueryDsl;
use dotenvy::dotenv;

#[macro_use]
extern crate diesel_migrations;
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};

const MIGRATIONS: EmbeddedMigrations = embed_migrations!("migrations/");

/// This struct is to be used for setting up integration tests for axum and diesel
pub struct TestContext {
    db_name: String,
}

impl TestContext {
    fn new(db_name: &str) -> Self {
        dotenv().expect("Make sure you have a .env in the project root directory");
        let mut connection = establish_connection(db_name);

        let query = diesel::sql_query(format!("CREATE DATABASE {}", db_name).as_str());

        query
            .execute(&mut connection)
            .expect(format!("Could not create database {}", db_name).as_str());

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
        let mut connection = establish_connection(&self.db_name);

        let query = diesel::sql_query(format!("DROP DATABASE {}", self.db_name).as_str());

        query
            .execute(&mut connection)
            .expect(format!("Could not drop database {}", self.db_name).as_str());
    }
}
