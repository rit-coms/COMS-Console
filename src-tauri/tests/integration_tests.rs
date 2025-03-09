use std::net::SocketAddr;

use app::{
    db::{
        create_user, get_user, insert_game,
        models::{Game, User},
        schema::games,
    },
    game_dev_api::{create_router, handlers::LeaderboardEntry, setup_game_dev_api},
};
use axum::ServiceExt;
use axum_test::TestServer;
use serde_json::json;
use test_context::TestContext;

#[macro_use]
extern crate diesel_migrations;

mod test_context;

async fn setup_initial_user_data(db_name: &str) {
    let users = vec![
        User {
            id: String::from("0"),
            name: String::from("user0"),
            rit_id: None,
        },
        User {
            id: String::from("1"),
            name: String::from("user1"),
            rit_id: None,
        },
    ];

    for user in users {
        create_user(&user.id, &user.name, db_name);
    }
}

async fn setup_initial_game_data(db_name: &str) {
    let games = vec![Game {
        id: String::from("0"),
        name: String::from("game0"),
    }];

    for game in games {
        insert_game(&game.id, &game.name, db_name);
    }
}

async fn setup_initial_data(db_name: &str) {
    setup_initial_game_data(db_name).await;
    setup_initial_game_data(db_name).await;
}

#[tokio::test]
async fn read_and_write_user_table_db() {
    let test_context = TestContext::new("read_and_write_user_table_db");

    // create test user
    let user_id_s = "1141245215512";
    let name_s = "A random user";

    create_user(user_id_s, name_s, &test_context.db_name).await;

    let result = get_user(name_s, user_id_s, &test_context.db_name).await;

    assert_eq!(user_id_s, result.id.as_str());
    assert_eq!(name_s, result.name.as_str());
}

#[tokio::test]
async fn read_and_write_leaderboard_data() {
    let test_context = TestContext::new("read_and_write_leaderboard_data");

    setup_initial_data(&test_context.db_name);

    let app: axum::Router = create_router(&test_context.db_name);

    let server: TestServer = TestServer::new(app).expect("Failed to set up test server");

    let value_name: String = String::from("score");
    let value_num: i64 = 100;

    let response: axum_test::TestResponse = server
        .post("/api/v1/leaderboard")
        .json(&LeaderboardEntry {
            value_name: value_name.clone(),
            value_num: value_num,
        })
        .await;

    response.assert_status_ok();
    let response_entry: LeaderboardEntry = response.json::<LeaderboardEntry>();

    assert_eq!(response_entry.value_name, value_name);
    assert_eq!(response_entry.value_num, value_num);
}
