use std::fs::remove_file;

use crate::db::{establish_connection, get_db_path};
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
use dotenvy::dotenv;

const MIGRATIONS: EmbeddedMigrations = embed_migrations!("migrations/");

/// This struct is to be used for setting up and automatically deleting database instances for testing.
/// * When this struct is created with new(), a temporary sqlite database is setup in the path designated
/// by the DATABASE_URL environment variable.
/// * When this struct falls out of scope, the temporary database file is automatically deleted.
/// # Usage
/// ```rust
/// #[test]
/// fn test_db() {
///     let test_context = TestContext::new("read_and_write_user_table_db");
///
///     // create test user
///     let user_id_s = "1141245215512";
///     let name_s = "A random user";
///
///     create_user(user_id_s, name_s, &test_context.db_name).await;
///
///     let result = get_user(name_s, user_id_s, &test_context.db_name).await;
///
///     assert_eq!(user_id_s, result.id.as_str());
///     assert_eq!(name_s, result.name.as_str());
/// }
/// ```
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
        remove_file(get_db_path(&self.db_name)).expect("Failed to delete file");
    }
}
