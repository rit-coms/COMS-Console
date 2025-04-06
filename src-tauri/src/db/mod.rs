use anyhow::{Error, Ok};
use axum::http::StatusCode;
use diesel::{insert_into, prelude::*, upsert::excluded};
use dotenvy::dotenv;
use models::*;
use regex::Regex;
use std::env;
use std::option::Option;
use std::path::Path;

pub mod models;
pub mod schema;
pub mod test_context;

/// Finds the filepath of a database using a given name.
///
/// This function will use the DATABASE_URL environment variable, but truncates the .db file and attaches the given db_name
/// to the path. If you want this path to math the DATABASE_URL variable, db_name should just be the name of the db file.
///
/// Ex: if DATABASE_URL="C:/Users/username/AppData/Roaming/coms-console/local.db", then db_name should be "local".
pub fn get_db_path(db_name: &str) -> String {
    dotenvy::dotenv().expect("Please create a .env file in the root directory of the project");
    Path::new(&env::var("DATABASE_URL").expect("DATABASE_URL must be set"))
        .parent()
        .unwrap()
        .join(db_name)
        .with_extension("db")
        .into_os_string()
        .into_string()
        .unwrap()
}

pub fn establish_connection(db_name: &str) -> SqliteConnection {
    dotenv().ok();

    // Here, just DATABASE_URL isn't used because we want to be able to specify different names for test databases.
    // If you want to use the real database, make sure db_name matches the name of the .db file in your .env file.
    let test_db_url = get_db_path(db_name);

    SqliteConnection::establish(test_db_url.as_str())
        .unwrap_or_else(|_| panic!("Error connecting to {}", test_db_url))
    // TODO handle database connection error
}

pub fn insert_game(id_s: &str, name_s: &str, is_installed: bool, db_name: &str) -> usize {
    use self::schema::games::dsl::*;
    let connection = &mut establish_connection(db_name);
    insert_into(games)
        .values((id.eq(id_s), name.eq(name_s), installed.eq(is_installed)))
        .on_conflict(name)
        .do_update()
        .set(installed.eq(is_installed))
        .execute(connection)
        .expect("Failed to insert game")
}

pub async fn insert_leaderboard_entry(
    user_id_s: &str,
    game_id_s: &str,
    value_name_s: &str,
    value_num_f: f64,
    db_name: &str,
) -> QueryResult<usize> {
    use self::schema::leaderboard::dsl::*;
    let mut connection = establish_connection(db_name);

    insert_into(leaderboard)
        .values((
            user_id.eq(user_id_s),
            game_id.eq(game_id_s),
            value_name.eq(value_name_s),
            value_num.eq(value_num_f),
        ))
        .on_conflict((user_id, game_id, value_name))
        .do_update()
        .set(value_name.eq(excluded(value_name)))
        .execute(&mut connection)
}

pub async fn get_leaderboard(
    game_id_s: Option<String>,
    user_id_s: Option<String>,
    num_entries: Option<i64>,
    ascending: Option<bool>,
    value_name_s: Option<String>,
    offset: Option<i64>,
    db_name: &str,
) -> Vec<LeaderboardEntry> {
    use self::schema::leaderboard::dsl::*;
    let mut connection = establish_connection(db_name);

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
    db_name: &str,
) -> Result<Vec<Save>, Error> {
    use self::schema::saves::dsl::*;
    validate_save_data_params(file_name_s, regx)?;

    let mut connection = establish_connection(db_name);

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

pub async fn create_user(id_s: &str, username_s: &str, db_name: &str) -> User {
    use self::schema::users::dsl::*;
    let connection = &mut establish_connection(db_name);
    insert_into(users)
        .values((id.eq(id_s), username.eq(username_s)))
        .get_result::<User>(connection)
        .expect("Could not create User")
}

pub async fn get_user(username_s: &str, user_id_s: &str, db_name: &str) -> User {
    use self::schema::users::dsl::*;
    let connection = &mut establish_connection(db_name);

    users
        .select(User::as_select())
        .filter(username.eq(username_s))
        .filter(id.eq(user_id_s))
        .first(connection)
        .expect("Error loading user data")
}

pub async fn set_save(
    user_id_s: &str,
    game_id_s: &str,
    file_name_s: &str,
    data_b: &Vec<u8>,
    db_name: &str,
) -> Save {
    use self::schema::saves::dsl::*;
    let connection = &mut establish_connection(db_name);
    insert_into(saves)
        .values((
            user_id.eq(user_id_s),
            game_id.eq(game_id_s),
            file_name.eq(file_name_s),
            data.eq(data_b),
        ))
        .execute(connection)
        .expect("Error inserting save");

    saves
        .select(Save::as_select())
        .filter(user_id.eq(user_id_s))
        .filter(game_id.eq(game_id_s))
        .filter(file_name.eq(file_name_s))
        .first(connection)
        .expect("Could not set save")
}

pub async fn get_save(user_id_s: &str, game_id_s: &str, file_name_s: &str, db_name: &str) -> Save {
    use self::schema::saves::dsl::*;
    let connection = &mut establish_connection(db_name);
    saves
        .select(Save::as_select())
        .filter(user_id.eq(user_id_s))
        .filter(game_id.eq(game_id_s))
        .filter(file_name.eq(file_name_s))
        .first(connection)
        .expect("Could not get save")
}

mod tests {
    use super::*;
    use crate::db::test_context::TestContext;

    #[tokio::test]
    pub async fn test_db() {
        use uuid::Uuid;
        let test_context = TestContext::new("test_db");

        let mut buffer = Uuid::encode_buffer();
        // create test user
        let user_id_s = Uuid::new_v4().as_simple().encode_lower(&mut buffer);
        let name_s = "A random user";

        let mut buffer = Uuid::encode_buffer();
        let user = create_user(user_id_s, name_s, &test_context.db_name).await;
        let game_id_s = Uuid::new_v4().as_simple().encode_lower(&mut buffer);
        let example_game_name = "Example Game";

        insert_game(game_id_s, example_game_name, true, &test_context.db_name);

        insert_leaderboard_entry(
            user_id_s,
            game_id_s,
            "spaghetti",
            10.0,
            &test_context.db_name,
        )
        .await;

        let file_name_s = "testpath";
        let data_b = "random_data".as_bytes().to_owned();

        set_save(
            user_id_s,
            game_id_s,
            file_name_s,
            &data_b,
            &test_context.db_name,
        )
        .await;
    }
}
