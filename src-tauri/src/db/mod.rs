use anyhow::{Error, Ok};
use axum::http::StatusCode;
use diesel::{insert_into, prelude::*, upsert::excluded};
use dotenvy::dotenv;
use models::*;
use regex::Regex;
use std::env;
use std::option::Option;
use std::path::Path;
use diesel::{expression::is_aggregate::No, insert_into, prelude::*, sql_types::Nullable};
use models::*;
use regex::Regex;
use std::option::Option;

pub mod models;
pub mod schema;
pub mod test_context;

use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!("migrations/");

pub fn setup_db(db_path: &str) {
    let mut connection = &mut establish_connection(db_path);

    connection
        .run_pending_migrations(MIGRATIONS)
        .expect("Failed to run migrations");
    println!("Pending migrations ran successfully");
}

pub fn establish_connection(db_path: &str) -> SqliteConnection {
    SqliteConnection::establish(db_path)
        .expect(format!("Failed to connect to database at {}", db_path).as_str())
    // TODO handle database connection error
}

pub fn insert_game(id_s: &str, name_s: &str, is_installed: bool, db_path: &str) -> usize {
    use self::schema::games::dsl::*;
    let connection = &mut establish_connection(db_path);
    insert_into(games)
        .values((id.eq(id_s), name.eq(name_s), installed.eq(is_installed)))
        .on_conflict(name)
        .do_update()
        .set(installed.eq(is_installed))
        .execute(connection)
        .expect("Failed to insert game")
}

/// Ensures a game exists in the data base by inserting the given game into the database
/// and doing nothing if there is a conflict.
pub fn make_sure_game_exists(name_s: &str, id_s: &str, db_path: &str) {
    use self::schema::games::dsl::*;
    let connection = &mut establish_connection(db_path);
    insert_into(games)
        .values((id.eq(id_s), name.eq(name_s), installed.eq(false)))
        .on_conflict_do_nothing()
        .execute(connection)
        .expect("Failed to insert game entry");
}

pub fn insert_leaderboard_entry(
    user_id_s: &str,
    game_id_s: &str,
    value_name_s: &str,
    value_num_f: f64,
    db_path: &str,
) -> QueryResult<usize> {
    use self::schema::leaderboard::dsl::*;
    let mut connection = establish_connection(db_path);

    insert_into(leaderboard)
        .values((
            user_id.eq(user_id_s),
            game_id.eq(game_id_s),
            value_name.eq(value_name_s),
            value_num.eq(value_num_f),
        ))
        .on_conflict_do_nothing()
        .execute(&mut connection)
}

pub async fn get_leaderboard(
    game_id_s: Option<String>,
    user_id_s: Option<String>,
    num_entries: Option<i64>,
    ascending: Option<bool>,
    value_name_s: Option<String>,
    offset: Option<i64>,
    db_path: &str,
) -> Vec<LeaderboardEntry> {
    use self::schema::leaderboard::dsl::*;
    let mut connection = establish_connection(db_path);

    let mut query = leaderboard.into_boxed(); // Selects all by default

    if let Some(game_id_s) = game_id_s {
        query = query.filter(game_id.eq(game_id_s));
    }

    if let Some(user_id_s) = user_id_s {
        query = query.filter(user_id.eq(user_id_s));
    }

    if let Some(num_entries) = num_entries {
        query = query.limit(num_entries);
    }

    if let Some(value_name_s) = value_name_s {
        query = query.filter(value_name.eq(value_name_s))
    }

    if let Some(ascending) = ascending {
        if ascending {
            query = query.order_by(value_num.asc());
        } else {
            query = query.order_by(value_num.desc());
        }
    } else {
        query = query.order_by(value_num.desc()); // Set leaderboard descending by default
    }

    if let Some(offset) = offset {
        query = query.offset(offset)
    }

    let results = query
        .get_results(&mut connection)
        .expect("Error loading leaderboard");

    results
}

fn validate_save_data_params(
    file_name: &Option<String>,
    regx: &Option<String>,
) -> Result<(), Error> {
    match (file_name, regx) {
        (Some(_), Some(_)) => Err(Error::msg("Save data con only be searched by file name or matching a regular expression, not both")),
        _ => Ok(())
    }
}

/// # Errors
/// * If both regx and filename_s parameters are passed as Some
/// * If regex is invalid or greater than the size limit
pub async fn get_save_data(
    game_id_s: &Option<String>,
    user_id_s: &Option<String>,
    file_name_s: &Option<String>,
    regx: &Option<String>,
    db_path: &str,
) -> Result<Vec<Save>, Error> {
    use self::schema::saves::dsl::*;
    validate_save_data_params(file_name_s, regx)?;

    let mut connection = establish_connection(db_path);

    let mut query = saves.into_boxed();

    if let Some(game_id_s) = game_id_s {
        query = query.filter(game_id.eq(game_id_s));
    }

    if let Some(user_id_s) = user_id_s {
        query = query.filter(user_id.eq(user_id_s));
    }

    if let Some(file_name_s) = file_name_s {
        query = query.filter(file_name.eq(file_name_s));
    }

    // TODO: uncomment when time_stamps implemented
    // if let Some(ascending) = ascending {
    //     if ascending {
    //         query = query.order(time_stamp.asc());
    //     } else {
    //         query = query.order(time_stamp.desc());
    //     }
    // } else {
    //     query = query.order(time_stamp.desc());
    // }

    let mut results: Vec<Save> = query
        .get_results(&mut connection)
        .expect("Error loading save data");

    if let Some(regex) = regx {
        let re = Regex::new(&regex)?;

        results = results
            .into_iter()
            .filter(|entry| re.is_match(&entry.file_name))
            .collect();

        Ok(results)
    } else {
        Ok(results)
    }
}

pub fn create_default_guest(db_path: &str) -> Vec<User> {
    use self::schema::users::dsl::*;
    const ID_S: &str = "1";
    const NAME_S: &str = "Guest";
    let connection = &mut establish_connection(db_path);
    insert_into(users)
        .values((id.eq(ID_S), name.eq(NAME_S)))
        .on_conflict(id)
        .do_update()
        .set((name.eq(NAME_S), rit_id.eq::<Option<&str>>(None)))
        .load::<User>(connection)
        .expect("Could not make sure Guest user exists")
}

pub fn create_user(id_s: &str, name_s: &str, db_path: &str) -> User {
    use self::schema::users::dsl::*;
    let connection = &mut establish_connection(db_path);
    insert_into(users)
        .values((id.eq(id_s), name.eq(name_s)))
        .get_result::<User>(connection)
        .expect("Could not create User")
}

pub async fn get_user(name_s: &str, user_id_s: &str, db_path: &str) -> User {
    use self::schema::users::dsl::*;
    let connection = &mut establish_connection(db_path);

    users
        .select(User::as_select())
        .filter(name.eq(name_s))
        .filter(id.eq(user_id_s))
        .first(connection)
        .expect("Error loading user data")
}

pub async fn set_save(
    user_id_s: &str,
    game_id_s: &str,
    file_name_s: &str,
    data_b: &Vec<u8>,
    db_path: &str,
) -> Save {
    use self::schema::saves::dsl::*;
    let connection = &mut establish_connection(db_path);
    insert_into(saves)
        .values((
            user_id.eq(user_id_s),
            game_id.eq(game_id_s),
            file_name.eq(file_name_s),
            data.eq(data_b),
        ))
        .on_conflict((user_id, file_name))
        .do_update()
        .set(data.eq(data_b))
        .execute(connection)
        .expect("Error inserting save");

    saves
        .select(Save::as_select())
        .filter(user_id.eq(user_id_s))
        .filter(game_id.eq(game_id_s))
        .filter(file_name.eq(file_name_s))
        .first(connection)
        .expect("Could not return inserted save")
}

pub async fn get_save(user_id_s: &str, game_id_s: &str, file_name_s: &str, db_path: &str) -> Save {
    use self::schema::saves::dsl::*;
    let connection = &mut establish_connection(db_path);
    saves
        .select(Save::as_select())
        .filter(user_id.eq(user_id_s))
        .filter(game_id.eq(game_id_s))
        .filter(file_name.eq(file_name_s))
        .first(connection)
        .expect("Could not get save")
}

/// Returns all leadboard data for a given game title.
/// In cases other than testing, db_path should be "local"
pub fn get_leaderboard_game_data(
    game_title: &str,
    db_path: &str,
) -> Result<Vec<LeaderboardEntry>, Error> {
    use self::schema::games::dsl::{games, name};
    use self::schema::leaderboard::dsl::{game_id, leaderboard};
    let connection = &mut establish_connection(db_path);

    let game = games
        .select(Game::as_select())
        .filter(name.eq(game_title))
        .first(connection)?;
    println!("Found game with title: {}", game.name);

    let data = leaderboard
        .select(LeaderboardEntry::as_select())
        .filter(game_id.eq(game.id))
        .get_results(connection)?;
    println!("Found {} entries for {}", data.len(), game.name);

    Ok(data)
}

/// Given an id, return the corresponding username
pub fn get_username(id_s: &str, db_path: &str) -> Result<String, Error> {
    use self::schema::users::dsl::*;
    let connection = &mut establish_connection(db_path);

    Ok(users.select(name).filter(id.eq(id_s)).first(connection)?)
}

mod tests {
    use super::*;
    use crate::db::test_context::{setup_initial_data, TestContext};

    #[tokio::test]
    pub async fn test_db() {
        use uuid::Uuid;
        let test_context = TestContext::new("test_db").await;

        let mut buffer = Uuid::encode_buffer();
        // create test user
        let user_id_s = Uuid::new_v4().as_simple().encode_lower(&mut buffer);
        let name_s = "A random user";

        let mut buffer = Uuid::encode_buffer();
        let user = create_user(user_id_s, name_s, &test_context.db_path);
        let game_id_s = Uuid::new_v4().as_simple().encode_lower(&mut buffer);
        let example_game_name = "Example Game";

        insert_game(game_id_s, example_game_name, true, &test_context.db_path);

        insert_leaderboard_entry(
            user_id_s,
            game_id_s,
            "spaghetti",
            10.0,
            &test_context.db_path,
        )
        .expect("Failed to insert entry");

        let file_name_s = "testpath";
        let data_b = "random_data".as_bytes().to_owned();

        set_save(
            user_id_s,
            game_id_s,
            file_name_s,
            &data_b,
            &test_context.db_path,
        )
        .await;
    }

    #[tokio::test]
    pub async fn test_get_username() {
        let context = TestContext::new("get_username").await;
        setup_initial_data(&context.db_path).await;

        let username = get_username("1", &context.db_path).expect("Failed to retrieve username");
        assert_eq!(username, "user1".to_string())
    }

    #[tokio::test]
    pub async fn test_get_leaderboard_game_data() {
        let context = TestContext::new("get_leaderboard_game_data").await;
        setup_initial_data(&context.db_path).await;

        let data = get_leaderboard_game_data("game0", &context.db_path)
            .expect("Failed to get leaderboard game data");
        assert!(data.len() == 3);
        println!("{:?}", data);
        data.iter()
            .find(|&entry| {
                entry.game_id == "0"
                    && entry.user_id == "1".to_string()
                    && entry.value_name == "Score".to_string()
            })
            .expect("Failed to find expected data!");
    }

    #[tokio::test]
    pub async fn test_create_default_guest() {
        let context = TestContext::new("create_default_guest").await;
        setup_initial_data(&context.db_path).await;

        // creates default guest
        let updated_users = create_default_guest(&context.db_path);

        assert!(updated_users.len() == 1); // test context already has a user with id 1
        let guest_user = updated_users.first().unwrap();
        assert_eq!(guest_user.id, "1");
        assert_eq!(guest_user.name, "Guest");
        assert_eq!(guest_user.rit_id, None);

        // shouldn't error out if the default guest already exists
        create_default_guest(&context.db_path);
    }
}
