use app::db::{create_user, get_user};
use test_context::TestContext;

#[macro_use]
extern crate diesel_migrations;

mod test_context;

#[tokio::test]
async fn write_and_read_user_table() {
    let test_context = TestContext::new("test1");

    // create test user
    let user_id_s = "1141245215512";
    let name_s = "A random user";

    create_user(user_id_s, name_s, &test_context.db_name).await;

    let result = get_user(name_s, user_id_s, &test_context.db_name).await;

    assert_eq!(user_id_s, result.id.as_str());
    assert_eq!(name_s, result.name.as_str());
}