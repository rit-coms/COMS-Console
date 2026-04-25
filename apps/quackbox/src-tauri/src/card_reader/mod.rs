use anyhow::Error;

// use tokio::io::BufReader;
use std::io::{BufRead, BufReader};
use std::num::ParseIntError;
use tokio::sync::mpsc::Sender;
use tokio::time::{sleep, Duration};
use tokio_serial::SerialPortInfo;

static DELAY_TIME: u64 = 1;

pub async fn start_id_recv(tx: Sender<[u8; 7]>) -> Result<(), Error> {
    loop {
        for SerialPortInfo {
            port_name,
            port_type,
        } in tokio_serial::available_ports()?
        {
            println!("Found port {port_name}");
        }
        let port_builder = tokio_serial::new("/dev/ttyACM1", 115200);
        println!("Attempting to connect to port");
        let port = port_builder.open();
        if let Ok(mut port) = port {
            println!("Connected to port");
            port.write_data_terminal_ready(true)?;
            let mut reader = BufReader::new(port);
            loop {
                let mut buf = String::new();
                while let Ok(_) = reader.read_line(&mut buf) {
                    // println!("{buf}");
                    let mut splits = buf.split(": ");

                    if let Some(split) = splits.next() {
                        if split != "Card ID" {
                            break;
                        }
                        if let Some(split) = splits.next() {
                            let split = split.trim();
                            // println!("Id Read: {split}");
                            let bytes: Result<Vec<u8>, ParseIntError> = (0..split.len())
                                .step_by(2)
                                .map(|i| u8::from_str_radix(&split[i..i + 2], 16))
                                .collect();
                            if let Ok(bytes) = bytes {
                                // println!("Sending id");
                                let out: [u8; 7] = bytes[0..7].try_into().unwrap();
                                tx.send(out).await?;
                            }
                        };
                    };
                    buf.clear();
                }
            }
        } else {
            println!("Could not find port");
            sleep(Duration::from_secs(DELAY_TIME)).await
        }
    }
}
