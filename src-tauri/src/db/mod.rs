use crate::db::schema::leaderboard::dsl::leaderboard;
use chrono::offset;
use core::num;
use diesel::connection;
use diesel::{insert_into, prelude::*, query_builder::AsQuery, select, update, upsert::excluded};
use dotenvy::dotenv;
use models::*;
use schema::{leaderboard::user_id, saves};
use std::env;
use std::option::Option;
use std::path::Path;

pub mod models;
pub mod schema;

pub fn establish_connection(db_name: &str) -> SqliteConnection {
    dotenv().ok();

    let test_db_url = Path::new(&env::var("ROOT_PATH").expect("ROOT_PATH must be set"))
        .join(db_name)
        .with_extension(".db");

    SqliteConnection::establish(test_db_url.to_str().unwrap())
        .unwrap_or_else(|_| panic!("Error connecting to {}", test_db_url.display()))
    // TODO handle database connection error
}

pub async fn insert_game(id_s: &str, name_s: &str, db_name: &str) -> QueryResult<usize> {
    use self::schema::games::dsl::*;
    let connection = &mut establish_connection(db_name);
    insert_into(games)
        .values((id.eq(id_s), name.eq(name_s)))
        .execute(connection)
}

pub async fn insert_leaderboard_entry(
    user_id_s: &str,
    game_id_s: &str,
    value_name_s: &str,
    value_num_i: i64,
    db_name: &str,
) -> QueryResult<usize> {
    use self::schema::leaderboard::dsl::*;
    let mut connection = establish_connection(db_name);

    insert_into(leaderboard)
        .values((
            user_id.eq(user_id_s),
            game_id.eq(game_id_s),
            value_name.eq(value_name_s),
            value_num.eq(value_num_i),
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

pub async fn get_save_data(
    game_id_s: Option<String>,
    user_id_s: Option<String>,
    num_entries: Option<i64>,
    offset: Option<i64>,
    ascending: Option<bool>, // By time_stamp
    db_name: &str,
) -> Vec<Save> {
    use self::schema::saves::dsl::*;
    let mut connection = establish_connection(db_name);

    let mut query = saves.into_boxed();

    if let Some(game_id_s) = game_id_s {
        query = query.filter(game_id.eq(game_id_s));
    }

    if let Some(user_id_s) = user_id_s {
        query = query.filter(user_id.eq(user_id_s));
    }

    if let Some(num_entries) = num_entries {
        query = query.limit(num_entries)
    }

    if let Some(offset) = offset {
        query = query.offset(offset)
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

    let results = query
        .get_results(&mut connection)
        .expect("Error loading save data");

    results
}

pub async fn create_user(id_s: &str, name_s: &str, db_name: &str) -> User {
    use self::schema::users::dsl::*;
    let mut connection = &mut establish_connection(db_name);
    insert_into(users)
        .values((id.eq(id_s), name.eq(name_s)))
        .get_result::<User>(connection)
        .expect("Could not create User")
}

pub async fn set_save(
    user_id_s: &str,
    game_id_s: &str,
    file_name_s: &str,
    data_b: &Vec<u8>,
    db_name: &str,
) -> Save {
    use self::schema::saves::dsl::*;
    let mut connection = &mut establish_connection(db_name);
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

pub async fn get_save(
    user_id_s: &str,
    game_id_s: &str,
    file_name_s: &str,
    db_name: &str,
) -> Save {
    use self::schema::saves::dsl::*;
    let mut connection = &mut establish_connection(db_name);
    saves
        .select(Save::as_select())
        .filter(user_id.eq(user_id_s))
        .filter(game_id.eq(game_id_s))
        .filter(file_name.eq(file_name_s))
        .first(connection)
        .expect("Could not get save")
}

/* mod tests {
    use super::*;
    extern crate tokio;

    #[tokio::test]
    pub async fn test_db() {
        use uuid::Uuid;

        let mut buffer = Uuid::encode_buffer();
        // create test user
        let user_id_s = Uuid::new_v4().as_simple().encode_lower(&mut buffer);
        let name_s = "A random user";

        let mut buffer = Uuid::encode_buffer();
        let user = create_user(user_id_s, name_s).await;
        let game_id_s = Uuid::new_v4().as_simple().encode_lower(&mut buffer);
        let example_game_name = "Example Game";

        insert_game(game_id_s, example_game_name).await;

        insert_leaderboard_entry(user_id_s, game_id_s, "spaghetti", 10, test_connection).await;

        let file_name_s = "testpath";
        let data_b = "random_data".as_bytes().to_owned();

        set_save(user_id_s, game_id_s, file_name_s, &data_b, test_connection).await;
    }
} */
