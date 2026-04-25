use anyhow::{Error, Ok};
use diesel::{expression::is_aggregate::No, insert_into, prelude::*};
use models::*;
use regex::Regex;
use std::option::Option;

pub mod models;
pub mod schema;
pub mod test_context;

use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};

use crate::{
    db::schema::{multiplayer, rit_login, users},
    game_dev_api::handlers::{LeaderboardEntryPostPayload, SavePostPayload},
};

pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!("migrations/");

pub fn setup_db(db_path: &str) {
    let connection = &mut establish_connection(db_path);

    connection
        .run_pending_migrations(MIGRATIONS)
        .expect("Failed to run migrations");
    println!("Pending migrations ran successfully");
}

pub fn establish_connection(db_path: &str) -> PgConnection {
    PgConnection::establish(db_path)
        .expect(format!("Failed to connect to database at {}", db_path).as_str())
    // TODO handle database connection error
}

/// Insert a new game into the database, doing nothing on a conflict
///
/// # Arguments
///
/// - `game` (`&Game`) - The Game object to enter.
/// - `db_path` (`&str`) - The URL path to the database.
///
/// # Returns
///
/// - `usize` - The number of rows affected
pub fn insert_game(game: &Game, db_path: &str) -> usize {
    use self::schema::game::dsl;
    let connection = &mut establish_connection(db_path);
    insert_into(dsl::game)
        .values(game)
        .on_conflict_do_nothing()
        .execute(connection)
        .expect("Failed to insert game")
}

pub async fn get_game(game_id: i32, db_path: &str) -> Game {
    use self::schema::game::dsl;
    let connection = &mut establish_connection(db_path);

    dsl::game
        .select(Game::as_select())
        .filter(dsl::game_id.eq(game_id))
        .first(connection)
        .expect("Failed to find game")
}

pub async fn get_all_games(db_path: &str) -> Vec<Game> {
    use self::schema::game::dsl;

    let connection = &mut establish_connection(db_path);

    dsl::game
        .select(Game::as_select())
        .get_results(connection)
        .expect("Failed to fetch all games")
}

pub async fn insert_multiplayer(
    multiplayer: &Multiplayer,
    db_path: &str,
) -> QueryResult<Multiplayer> {
    use self::schema::multiplayer::dsl;
    let connection = &mut establish_connection(db_path);

    insert_into(dsl::multiplayer)
        .values(multiplayer)
        .on_conflict_do_nothing()
        .get_result(connection)
}

pub fn insert_leaderboard_entry(
    leaderboard_entry: &LeaderboardEntryPostPayload,
    db_path: &str,
) -> QueryResult<LeaderboardEntry> {
    use self::schema::leaderboard_entry::dsl;
    let connection = &mut establish_connection(db_path);

    insert_into(dsl::leaderboard_entry)
        .values(leaderboard_entry)
        .on_conflict_do_nothing()
        .get_result(connection)
}

pub async fn get_leaderboard_entry(
    user_id: impl Into<Option<&i32>>,
    game_id: impl Into<Option<&i32>>,
    value_name: impl Into<Option<&String>>,
    num_entries: impl Into<Option<&i64>>,
    ascending: impl Into<Option<&bool>>,
    offset: impl Into<Option<&i64>>,
    db_path: &str,
) -> Vec<LeaderboardEntry> {
    use self::schema::leaderboard_entry::dsl;
    let mut connection = establish_connection(db_path);

    let mut query = dsl::leaderboard_entry.into_boxed(); // Selects all by default

    if let Some(game_id) = game_id.into() {
        query = query.filter(dsl::game_id.eq(game_id));
    }

    if let Some(user_id) = user_id.into() {
        query = query.filter(dsl::user_id.eq(user_id));
    }

    if let Some(num_entries) = num_entries.into() {
        query = query.limit(*num_entries);
    }

    if let Some(value_name) = value_name.into() {
        query = query.filter(dsl::value_name.eq(value_name))
    }

    if let Some(ascending) = ascending.into() {
        if *ascending {
            query = query.order_by(dsl::value_num.asc());
        } else {
            query = query.order_by(dsl::value_num.desc());
        }
    } else {
        query = query.order_by(dsl::value_num.desc()); // Set leaderboard descending by default
    }

    if let Some(offset) = offset.into() {
        query = query.offset(*offset)
    }

    let results = query
        .get_results(&mut connection)
        .expect("Error loading leaderboard");

    results
}

fn validate_save_data_params(
    file_name: &Option<String>,
    regex: &Option<String>,
) -> Result<(), Error> {
    match (file_name, regex) {
        (Some(_), Some(_)) => Err(Error::msg("Save data can only be searched by file name or matching a regular expression, not both")),
        _ => Ok(())
    }
}

/// # Errors
/// * If both regx and filename parameters are passed as Some
/// * If regex is invalid or greater than the size limit
pub async fn get_save_data(
    game_id: impl Into<Option<&i32>>,
    user_id: impl Into<Option<&i32>>,
    filename: impl Into<Option<String>>,
    regex: impl Into<Option<String>>,
    db_path: &str,
) -> Result<Vec<Save>, Error> {
    use self::schema::saves::dsl;
    let filename_val: Option<String> = filename.into();
    let regex_val: Option<String> = regex.into();
    validate_save_data_params(&filename_val, &regex_val)?;

    let mut connection = establish_connection(db_path);

    let mut query = dsl::saves.into_boxed();

    if let Some(game_id_val) = game_id.into() {
        query = query.filter(dsl::game_id.eq(game_id_val));
    }

    if let Some(user_id_val) = user_id.into() {
        query = query.filter(dsl::user_id.eq(user_id_val));
    }

    if let Some(file_name_val) = filename_val {
        query = query.filter(dsl::filename.eq(file_name_val));
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

    if let Some(regex_val) = regex_val {
        let re = Regex::new(&regex_val)?;

        results = results
            .into_iter()
            .filter(|entry| re.is_match(&entry.filename))
            .collect();

        Ok(results)
    } else {
        Ok(results)
    }
}

pub fn create_guest_user(db_path: &str) -> Vec<User> {
    use self::schema::users::dsl::*;
    const NAME_S: &str = "Guest";
    let connection = &mut establish_connection(db_path);
    insert_into(users)
        .values((username.eq(NAME_S), crumbs.eq(0)))
        .on_conflict_do_nothing()
        .load::<User>(connection)
        .expect("Could not make sure Guest user exists")
}

pub fn create_user(user: &User, db_path: &str) -> User {
    use self::schema::users::dsl::*;
    let connection = &mut establish_connection(db_path);
    insert_into(users)
        .values(user)
        .get_result::<User>(connection)
        .expect("Could not create User")
}

pub async fn get_user(user_id: i32, db_path: &str) -> User {
    use self::schema::users::dsl;
    let connection = &mut establish_connection(db_path);

    dsl::users
        .select(User::as_select())
        .filter(dsl::user_id.eq(user_id))
        .first(connection)
        .expect("Error loading user data")
}

pub async fn get_uid_usernames(uid: String, db_path: &str) -> String {
    use crate::db::users::dsl;
    let connection = &mut establish_connection(db_path);
    rit_login::table
        .inner_join(dsl::users.on(users::user_id.eq(rit_login::user_id)))
        .filter(rit_login::rit_uid.eq(uid))
        .select((users::username))
        .first(connection)
        .expect("Failed to find username for given uuid")
}

pub async fn set_save(save: &SavePostPayload, db_path: &str) -> Save {
    use self::schema::saves::dsl;
    let connection = &mut establish_connection(db_path);
    insert_into(dsl::saves)
        .values(save)
        .on_conflict((dsl::user_id, dsl::filename))
        .do_update()
        .set(dsl::data.eq(&save.data))
        .execute(connection)
        .expect("Error inserting save");

    dsl::saves
        .select(Save::as_select())
        .filter(dsl::user_id.eq(save.user_id))
        .filter(dsl::game_id.eq(save.game_id))
        .filter(dsl::filename.eq(&save.filename))
        .first(connection)
        .expect("Could not return inserted save")
}

pub async fn get_save(save_id: i32, db_path: &str) -> Save {
    use self::schema::saves::dsl;
    let connection = &mut establish_connection(db_path);
    dsl::saves
        .select(Save::as_select())
        .filter(dsl::save_id.eq(save_id))
        .first(connection)
        .expect("Could not get save")
}

/// Returns all leadboard entries for a given game title.
pub fn get_leaderboard_entries(
    game_title: &str,
    db_path: &str,
) -> Result<Vec<LeaderboardEntry>, Error> {
    use self::schema::game;
    use self::schema::leaderboard_entry;
    let connection = &mut establish_connection(db_path);

    let game = game::dsl::game
        .select(Game::as_select())
        .filter(game::dsl::title.eq(game_title))
        .first(connection)?;
    println!("Found game with title: {}", game.title);

    let data = leaderboard_entry::dsl::leaderboard_entry
        .select(LeaderboardEntry::as_select())
        .filter(leaderboard_entry::dsl::game_id.eq(game.game_id))
        .get_results(connection)?;
    println!("Found {} entries for {}", data.len(), game.title);

    Ok(data)
}

/// Given an id, return the corresponding username
pub fn get_username(user_id: i32, db_path: &str) -> Result<String, Error> {
    use self::schema::users::dsl;
    let connection = &mut establish_connection(db_path);

    Ok(dsl::users
        .select(dsl::username)
        .filter(dsl::user_id.eq(user_id))
        .first(connection)?)
}

mod tests {
    // TODO: write tests cuz they all gone now jared was here
}
