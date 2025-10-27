use quackbox_backend::{db::test_context::{setup_initial_data, TestContext}, game_dev_api::v2_handlers::{self, LeaderboardGetParams, LeaderboardPost, SaveDataGetParams }};
use serde_json::json;

const SAVE_DATA_PATH: &str = "/api/v2/save-data";
const LEADERBOARD_PATH: &str = "/api/v2/leaderboard";

#[tokio::test]
async fn read_and_write_save_data() {
    let test_context = TestContext::new("read_and_write_save_data_v2").await;

    setup_initial_data(test_context.get_db_path()).await;

    // set game id to 0
    test_context
        .current_game_tx
        .send(Some(0))
        .expect("No subscriber to the current game sender");
    test_context.notifier.notified().await;

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

    // Write data to player_slot 1
    let post_response: axum_test::TestResponse = test_context
        .server
        .post(&(SAVE_DATA_PATH.to_owned() + "/player_slots/1"))
        .json(&v2_handlers::SaveDataPost {
            file_name: file_name.clone(),
            data: data.clone(),
        })
        .await;

    post_response.assert_status_ok();
    let post_response_entry: v2_handlers::SaveDataPost = post_response.json::<v2_handlers::SaveDataPost>();

    assert_eq!(post_response_entry.file_name, file_name);
    assert_eq!(post_response_entry.data, data);

    let get_save_info_response = test_context
        .server
        .get(&(SAVE_DATA_PATH.to_owned() + "/player_slots/1/info"))
        .add_query_params(SaveDataGetParams {
            regex: Some(file_name.clone()),
            limit: None,
            offset: None,
            ascending: None
        })
        .await;

    get_save_info_response.assert_json_contains(&json!([{
        "file_name": "test data"
    }]));
        
    let get_filename_response: axum_test::TestResponse = test_context
        .server
        .get(&(SAVE_DATA_PATH.to_owned() + "/player_slots/1"))
        .add_query_params(SaveDataGetParams {
            regex: Some(file_name.clone()),
            limit: None,
            offset: None,
            ascending: None
        })
        .await;

    get_filename_response.assert_status_ok();
    let get_response_entries = get_filename_response.json::<Vec<v2_handlers::SaveDataPost>>();
    let get_response_entry = get_response_entries
        .get(0)
        .expect("No entries in leaderboard get response");

    assert_eq!(get_response_entry.file_name, file_name);
    assert_eq!(get_response_entry.data, data);
}

#[tokio::test]
async fn read_and_write_leaderboard_data() {
    let test_context = TestContext::new("read_and_write_leaderboard_data_v2").await;

    setup_initial_data(test_context.get_db_path()).await;

    // set game id to 1
    test_context
        .current_game_tx
        .send(Some(1))
        .expect("No subscriber to the current game sender");
    test_context.notifier.notified().await;

    let value_name: String = String::from("score");
    let value_num: f64 = 100.0;

    let post_response = test_context
        .server
        .post(&(LEADERBOARD_PATH.to_owned() + "/Money/1"))
        .json(&LeaderboardPost {
            value_num: value_num,
        })
        .await;

    post_response.assert_status_ok();
    post_response.assert_json_contains(&json!({
        "leaderboard_name":"Money",
        "value_num": value_num,
        "user_id": "1"
    }));

    let get_response: axum_test::TestResponse = test_context
        .server
        .get(&(LEADERBOARD_PATH.to_owned() + "/Money/1"))
        .add_query_params(LeaderboardGetParams {
            limit: None,
            offset: None,
            ascending: None,
        })
        .await;

    get_response.assert_status_ok();
    get_response.assert_json_contains(&json!([{
            "leaderboard_name": "Money",
            "value_num": value_num,
            "user_id": "1",
    }]));

}
