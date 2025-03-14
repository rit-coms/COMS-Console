use app::{
    db::{
        create_user, get_user, insert_game,
        models::{Game, User},
        test_context::TestContext,
    },
    game_dev_api::{
        create_router,
        handlers::{
            LeaderboardEntry, LeaderboardGetParams, LeaderboardScope, SaveDataEntry,
            SaveDataGetParams,
        },
    },
};
use axum_test::TestServer;

extern crate diesel_migrations;

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
        create_user(&user.id, &user.name, db_name).await;
    }
}

async fn setup_initial_game_data(db_name: &str) {
    let games = vec![Game {
        id: String::from("0"),
        name: String::from("game0"),
    }];

    for game in games {
        insert_game(&game.id, &game.name, db_name).await;
    }
}

async fn setup_initial_data(db_name: &str) {
    setup_initial_game_data(db_name).await;
    setup_initial_user_data(db_name).await;
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
    let leaderboard_path = "/api/v1/leaderboard";

    setup_initial_data(&test_context.db_name).await;

    let app: axum::Router = create_router(&test_context.db_name);

    let server: TestServer = TestServer::new(app).expect("Failed to set up test server");

    let value_name: String = String::from("score");
    let value_num: i64 = 100;

    let post_response: axum_test::TestResponse = server
        .post(leaderboard_path)
        .json(&LeaderboardEntry {
            value_name: value_name.clone(),
            value_num: value_num,
        })
        .await;

    post_response.assert_status_ok();
    let post_response_entry: LeaderboardEntry = post_response.json::<LeaderboardEntry>();

    assert_eq!(post_response_entry.value_name, value_name);
    assert_eq!(post_response_entry.value_num, value_num);

    let get_response: axum_test::TestResponse = server
        .get(leaderboard_path)
        .add_query_params(LeaderboardGetParams {
            scope: Some(LeaderboardScope::User),
            count: Some(1),
            ascending: None,
            value_name: Some(value_name.clone()),
            offset: None,
        })
        .await;

    get_response.assert_status_ok();
    let get_response_entries = get_response.json::<Vec<LeaderboardEntry>>();
    let get_response_entry = get_response_entries
        .get(0)
        .expect("No entries in leaderboard get response");

    assert_eq!(get_response_entry.value_name, value_name);
    assert_eq!(get_response_entry.value_num, value_num);
}

#[tokio::test]
async fn read_and_write_save_data() {
    let test_context = TestContext::new("read_and_write_save_data");
    let save_data_path = "/api/v1/save-data";

    setup_initial_data(&test_context.db_name).await;

    let app: axum::Router = create_router(&test_context.db_name);

    let server: TestServer = TestServer::new(app).expect("Failed to set up test server");

    let file_name: String = String::from("test data");
    let data: serde_json::Value = serde_json::json!({
        "level":12,
        "money":1515,
        "BAC":0.31,
        "items": [
            {"name": "Excalibur", "damage": 43},
            {"name": "healing potion", "damage": 0}
        ]
    });

    let post_response: axum_test::TestResponse = server
        .post(save_data_path)
        .json(&SaveDataEntry {
            file_name: file_name.clone(),
            data: data.clone(),
        })
        .await;

    post_response.assert_status_ok();
    let post_response_entry: SaveDataEntry = post_response.json::<SaveDataEntry>();

    assert_eq!(post_response_entry.file_name, file_name);
    assert_eq!(post_response_entry.data, data);

    let get_filename_response: axum_test::TestResponse = server
        .get(save_data_path)
        .add_query_params(SaveDataGetParams {
            file_name: Some(file_name.clone()),
            count: None,
            offset: None,
            ascending: None,
        })
        .await;

    get_filename_response.assert_status_ok();
    let get_response_entries = get_filename_response.json::<Vec<SaveDataEntry>>();
    let get_response_entry = get_response_entries
        .get(0)
        .expect("No entries in leaderboard get response");

    assert_eq!(get_response_entry.file_name, file_name);
    assert_eq!(get_response_entry.data, data);
}

#[tokio::test]
async fn get_save_data_error() {
    let test_context = TestContext::new("get_save_data_error");
    let save_data_path = "/api/v1/save-data";

    setup_initial_data(&test_context.db_name).await;

    let app: axum::Router = create_router(&test_context.db_name);

    let server: TestServer = TestServer::new(app).expect("Failed to set up test server");

    let file_name: String = String::from("test data");
    let data: serde_json::Value = serde_json::json!({
        "level":12,
        "money":1515,
        "BAC":0.31,
        "items": [
            {"name": "Excalibur", "damage": 43},
            {"name": "healing potion", "damage": 0}
        ]
    });

    let post_response: axum_test::TestResponse = server
        .post(save_data_path)
        .json(&SaveDataEntry {
            file_name: file_name.clone(),
            data: data.clone(),
        })
        .await;

    post_response.assert_status_ok();
    let post_response_entry: SaveDataEntry = post_response.json::<SaveDataEntry>();

    assert_eq!(post_response_entry.file_name, file_name);
    assert_eq!(post_response_entry.data, data);

    let get_missing_params_error_response: axum_test::TestResponse = server
        .get(save_data_path)
        .add_query_params(SaveDataGetParams {
            file_name: Some(file_name.clone()),
            count: Some(10),
            offset: None,
            ascending: None,
        })
        .await;

    get_missing_params_error_response.assert_status_bad_request();
}
