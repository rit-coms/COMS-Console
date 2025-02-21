use axum::{response::IntoResponse, routing::get, Json, Router};


async fn hello_world_handler() -> impl IntoResponse {
    let json_response = serde_json::json!({
        "message":"Hello world!"
    });

    Json(json_response)
}

pub async fn setup_routes() {
    let app = Router::new().route("/api/healthchecker", get(hello_world_handler));
    
    println!("Server started successfully!!!");
    let listener = tokio::net::TcpListener::bind("127.0.0.1:8000").await.unwrap(); // TODO make the port configurable
    axum::serve(listener, app).await.unwrap();
}