use diesel::{insert_into, prelude::*, query_builder::AsQuery, select, update, upsert::excluded};
use dotenvy::dotenv;
use models::*;
use schema::{leaderboard::user_id, saves};
use std::env;

pub mod models;
pub mod schema;

pub fn establish_connection() -> SqliteConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    SqliteConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url)) // TODO handle database connection error
}

pub async fn insert_game(
    id_s: &str,
    name_s: &str
) -> QueryResult<usize> {
    use self::schema::games::dsl::*;
    let connection = &mut establish_connection();
    insert_into(games).values((
        id.eq(id_s),
        name.eq(name_s)
    )).execute(connection)
}

pub async fn get_all_games() -> Vec<Game> {
    use self::schema::games::dsl::*;
    let connection = &mut establish_connection();
    games
        .select(Game::as_select())
        .get_results(connection)
        .expect("Error loading leaderboard")
}

pub async fn insert_leaderboard_entry(
    user_id_s: &str,
    game_id_s: &str,
    value_name_s: &str,
    value_num_i: i64,
) -> QueryResult<usize> {
    use self::schema::leaderboard::dsl::*;
    let connection = &mut establish_connection();
    insert_into(leaderboard).values((
        user_id.eq(user_id_s),
        game_id.eq(game_id_s),
        value_name.eq(value_name_s),
        value_num.eq(value_num_i)
    ))
    .on_conflict((user_id, game_id, value_name))
    .do_update()
    .set(value_name.eq(excluded(value_name)))
    .execute(connection)
}

pub async fn get_top_n_leaderboard_entries(
    game_id_s: &str,
    value_name_s: &str,
    num_entries: i64,
    min_is_best: bool
) -> Vec<LeaderboardEntry> {
    use self::schema::leaderboard::dsl::*;
    let connection = &mut establish_connection();

    let order: Box<dyn BoxableExpression<_, _, SqlType = _>> = if min_is_best {
        Box::new(value_num.asc())
    } else {
        Box::new(value_num.desc())
    };

    let result = leaderboard
        .select(LeaderboardEntry::as_select())
        .filter(game_id.eq(game_id_s))
        .filter(value_name.eq(value_name_s))
        .order_by(order)
        .limit(num_entries)
        .get_results(connection)
        .expect("Error loading leaderboard");
    result
}

pub async fn get_all_user_leaderboard_entries(
    user_id_s: &str
) -> Vec<LeaderboardEntry> {
    use self::schema::leaderboard::dsl::*;
    let connection = &mut establish_connection();
    let result = leaderboard
        .select(LeaderboardEntry::as_select())
        .filter(user_id.eq(user_id_s))
        .get_results(connection)
        .expect("Error loading leaderboard");
    result
}

pub async fn get_leaderboard_entry(
    user_id_s: &str,
    game_id_s: &str,
    value_name_s: &str
) -> LeaderboardEntry {
    use self::schema::leaderboard::dsl::*;
    let connection = &mut establish_connection();
    leaderboard
        .select(LeaderboardEntry::as_select())
        .filter(user_id.eq(user_id_s))
        .filter(game_id.eq(game_id_s))
        .filter(value_name.eq(value_name_s))
        .first(connection)
        .expect("Error loading leaderboard")
}

pub async fn create_user(
    id_s: &str,
    name_s: &str
) -> User {
    use self::schema::users::dsl::*;
    let connection = &mut establish_connection();
    insert_into(users)
    .values((id.eq(id_s), name.eq(name_s)))
    .get_result::<User>(connection)
    .expect("Could not create User")
}

pub async fn get_all_saves(
    user_id_s: &str,
    game_id_s: &str
) -> Vec<Save> {
    use self::schema::saves::dsl::*;
    let connection = &mut establish_connection();
    saves
        .select(Save::as_select())
        .filter(user_id.eq(user_id_s))
        .filter(game_id.eq(game_id_s))
        .get_results(connection)
        .expect("Could not get save")
}

pub async fn set_save(
    user_id_s: &str,
    game_id_s: &str,
    file_name_s: &str,
    data_b: &Vec<u8>
) -> Save {
    use self::schema::saves::dsl::*;
    let connection = &mut establish_connection();
    insert_into(saves)
    .values((user_id.eq(user_id_s), game_id.eq(game_id_s), file_name.eq(file_name_s), data.eq(data_b)))
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
    file_name_s: &str
) -> Save {
    use self::schema::saves::dsl::*;
    let connection = &mut establish_connection();
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
    
        insert_leaderboard_entry(user_id_s, game_id_s, "spaghetti", 10).await;
    
        let file_name_s = "testpath";
        let data_b = "random_data".as_bytes().to_owned();
    
        set_save(user_id_s, game_id_s, file_name_s, &data_b).await;
    
        println!("{:#?}", get_all_games().await);
        println!("{:#?}", get_all_user_leaderboard_entries(user_id_s).await);
        println!("{:#?}", get_all_saves(user_id_s, game_id_s).await);
    }

}