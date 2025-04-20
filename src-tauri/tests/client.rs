use std::ops::ControlFlow;

use futures_util::{SinkExt, StreamExt};
use tokio_tungstenite::{
    connect_async,
    tungstenite::{
        protocol::{frame::coding::CloseCode, CloseFrame},
        Message,
    },
};

const SERVER: &str = "ws://127.0.0.1:8000/api/v1/player-slots-ws";

#[tokio::test]
async fn main() {
    println!("Spawning client");
    spawn_client().await;
}

async fn spawn_client() {
    let ws_stream = match connect_async(SERVER).await {
        Ok((stream, response)) => {
            println!("Handshake for client has been completed");
            // This will be the HTTP response, same as with server this is the last moment we
            // can still access HTTP stuff.
            println!("Server response was {response:?}");
            stream
        }
        Err(e) => {
            println!("WebSocket handshake for client failed with {e}!");
            return;
        }
    };

    let (mut sender, mut receiver) = ws_stream.split();

    //we can ping the server for start
    sender
        .send(Message::Ping(
            axum::body::Bytes::from_static(b"Hello, Server!").to_vec(),
        ))
        .await
        .expect("Can not send!");

    //spawn an async sender to push some more messages into the server
    let mut send_task = tokio::spawn(async move {
        for i in 1..30 {
            // In any websocket error, break loop.
            if sender
                .send(Message::Text(format!("Message number {i}...").into()))
                .await
                .is_err()
            {
                //just as with server, if send fails there is nothing we can do but exit.
                return;
            }

            tokio::time::sleep(std::time::Duration::from_millis(300)).await;
        }

        // When we are done we may want our client to close connection cleanly.
        println!("Sending close...");
        if let Err(e) = sender
            .send(Message::Close(Some(CloseFrame {
                code: CloseCode::Normal,
                reason: std::borrow::Cow::Borrowed("Goodbye"),
            })))
            .await
        {
            println!("Could not send Close due to {e:?}, probably it is ok?");
        };
    });

    //receiver just prints whatever it gets
    let mut recv_task = tokio::spawn(async move {
        while let Some(Ok(msg)) = receiver.next().await {
            // print message and break if instructed to do so
            if process_message(msg).is_break() {
                break;
            }
        }
    });

    //wait for either task to finish and kill the other task
    tokio::select! {
        _ = (&mut send_task) => {
            recv_task.abort();
        },
        _ = (&mut recv_task) => {
            send_task.abort();
        }
    }
}

fn process_message(msg: Message) -> ControlFlow<(), ()> {
    match msg {
        Message::Text(text) => {
            println!("got str: {text}");
        }
        Message::Binary(items) => {
            println!("got {} bytes: {:?}", items.len(), items);
        }
        Message::Ping(items) => {
            println!("got ping with {items:?}");
        }
        Message::Pong(items) => {
            println!("got pong with {items:?}");
        }
        Message::Close(close_frame) => {
            if let Some(cf) = close_frame {
                println!("got close with code {} with reason {}", cf.code, cf.reason);
            } else {
                println!("got close message without close frame");
            }
            return ControlFlow::Break(());
        }
        Message::Frame(_) => {
            unreachable!("This is never supposed to happen");
        }
    }
    ControlFlow::Continue(())
}
