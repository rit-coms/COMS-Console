// @generated automatically by Diesel CLI.

diesel::table! {
    games (id) {
        id -> Text,
        name -> Text,
    }
}

diesel::table! {
    leaderboard (row_id) {
        row_id -> Integer,
        user_id -> Text,
        game_id -> Text,
        value_name -> Text,
        value_num -> Double,
    }
}

diesel::table! {
    saves (row_id) {
        row_id -> Integer,
        user_id -> Text,
        game_id -> Text,
        file_name -> Text,
        data -> Binary,
    }
}

diesel::table! {
    users (id) {
        id -> Text,
        name -> Text,
        rit_id -> Nullable<Text>,
    }
}

diesel::joinable!(leaderboard -> games (game_id));
diesel::joinable!(leaderboard -> users (user_id));
diesel::joinable!(saves -> games (game_id));
diesel::joinable!(saves -> users (user_id));

diesel::allow_tables_to_appear_in_same_query!(
    games,
    leaderboard,
    saves,
    users,
);
