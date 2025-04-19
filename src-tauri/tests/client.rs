use app::game_dev_api::VERSION;
use tokio_tungstenite::connect_async;

const SERVER: &str = "ws://127.0.0.1:8000/v1/player-slots-ws";

async fn spawn_client() {
    let ws_stream = match connect_async(SERVER).await {
            Ok((stream, response)) => {
                
            }
    }
}
