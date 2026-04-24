// @generated automatically by Diesel CLI.

diesel::table! {
    authentication_manager (user_id) {
        user_id -> Int4,
    }
}

diesel::table! {
    belongs_to (game_id, genre_id) {
        game_id -> Int4,
        genre_id -> Int4,
    }
}

diesel::table! {
    favorites (user_id, game_id) {
        user_id -> Int4,
        game_id -> Int4,
        favorite_time -> Timestamptz,
    }
}

diesel::table! {
    game (game_id) {
        game_id -> Int4,
        #[max_length = 250]
        title -> Varchar,
        #[max_length = 150]
        author -> Varchar,
        #[max_length = 500]
        summary -> Varchar,
        release_date -> Timestamptz,
        cover_image -> Bytea,
        multiplayer_id -> Int4,
    }
}

diesel::table! {
    game_image (game_image_id) {
        game_image_id -> Int4,
        game_id -> Int4,
        image -> Bytea,
        #[max_length = 30]
        shape -> Varchar,
    }
}

diesel::table! {
    genre (genre_id) {
        genre_id -> Int4,
        #[max_length = 100]
        genre_name -> Varchar,
    }
}

diesel::table! {
    leaderboard_entry (lb_entry_id) {
        lb_entry_id -> Int4,
        user_id -> Int4,
        game_id -> Int4,
        value_num -> Float8,
        #[max_length = 150]
        value_name -> Varchar,
        lb_timestamp -> Timestamptz,
    }
}

diesel::table! {
    local_login (local_login_id) {
        local_login_id -> Int4,
        user_id -> Int4,
        #[max_length = 98]
        salthash -> Bpchar,
    }
}

diesel::table! {
    multiplayer (multiplayer_id) {
        multiplayer_id -> Int4,
        local_min -> Int4,
        local_max -> Int4,
        online_multiplayer -> Bool,
    }
}

diesel::table! {
    plays (user_id, game_id) {
        user_id -> Int4,
        game_id -> Int4,
        time_begin -> Timestamptz,
        time_end -> Timestamptz,
    }
}

diesel::table! {
    reviews (user_id, game_id) {
        user_id -> Int4,
        game_id -> Int4,
        review_time -> Timestamptz,
        is_liked -> Bool,
    }
}

diesel::table! {
    rit_login (rit_login_id) {
        rit_login_id -> Int4,
        user_id -> Int4,
        #[max_length = 32]
        rit_uid -> Bpchar,
    }
}

diesel::table! {
    saves (filename, user_id, game_id) {
        #[max_length = 200]
        filename -> Varchar,
        user_id -> Int4,
        game_id -> Int4,
        data -> Bytea,
        save_timestamp -> Timestamptz,
    }
}

diesel::table! {
    users (user_id) {
        user_id -> Int4,
        #[max_length = 150]
        username -> Varchar,
        #[max_length = 500]
        about_me -> Nullable<Varchar>,
        profile_pic -> Nullable<Bytea>,
        crumbs -> Int4,
    }
}

diesel::joinable!(authentication_manager -> users (user_id));
diesel::joinable!(belongs_to -> game (game_id));
diesel::joinable!(belongs_to -> genre (genre_id));
diesel::joinable!(favorites -> game (game_id));
diesel::joinable!(favorites -> users (user_id));
diesel::joinable!(game -> multiplayer (multiplayer_id));
diesel::joinable!(game_image -> game (game_id));
diesel::joinable!(leaderboard_entry -> game (game_id));
diesel::joinable!(leaderboard_entry -> users (user_id));
diesel::joinable!(local_login -> authentication_manager (user_id));
diesel::joinable!(plays -> game (game_id));
diesel::joinable!(plays -> users (user_id));
diesel::joinable!(reviews -> game (game_id));
diesel::joinable!(reviews -> users (user_id));
diesel::joinable!(rit_login -> authentication_manager (user_id));
diesel::joinable!(saves -> game (game_id));
diesel::joinable!(saves -> users (user_id));

diesel::allow_tables_to_appear_in_same_query!(
    authentication_manager,
    belongs_to,
    favorites,
    game,
    game_image,
    genre,
    leaderboard_entry,
    local_login,
    multiplayer,
    plays,
    reviews,
    rit_login,
    saves,
    users,
);
