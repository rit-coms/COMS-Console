import React, { useEffect, useState } from "react";
import { useGamepadContext, usePageContext, useToastContext } from "../context/contexts";
import { Modal, PlayerContainer, PlayerTile } from "quackbox-design-system";
import duck_connected from '../assets/duck_connected.png'

export default function ControllerConnectPage() {

    const { players, setPlayers, pressedButton, setAllPlayersConnected, disconnectGamepad, setButtonAction } = useGamepadContext();
    const { updatePageElements, updatePage } = usePageContext();
    const { showToast } = useToastContext();
    const [connected, setConnected] = useState(-1);
    
    useEffect(() => {
        players.length !== 0 && updatePageElements("controller connect");
    }, [players.length]);
    
    useEffect(() => {
        setTimeout(() => {
            updatePage("controller connect");
        }, 0);
    }, []);

    useEffect(() => {
        if (connected === -1) return;
        setTimeout(() => {
            showToast(`Player ${connected} successfully connected`, "success");   
        }, 250);
        setConnected(-1);
    }, [connected]);
    
    useEffect(() => {
        setPlayers((prevPlayers) => {
            return prevPlayers.map((player, index) => {
                // Check when the RIGHT TRIGGER is clicked to connect player
                if (pressedButton[index] === "RIGHT TRIGGER" && !player.isConnected) {
                    updatePageElements("controller connect");
                    setTimeout(() => {
                        setConnected(index+1);
                    }, 0);
                    return { ...player, isConnected: true };
                }

                return player;
            });
        });
    }, [pressedButton]);

    const handleConfirmation = () => {

        if (players.length <= 0)
            return;

        const totalPlayers = players.length;
        const disconnectedPlayers = (players.map((player) => !player.isConnected ? player.playerIndex : null));
        const disconnectedPlayersIndex = disconnectedPlayers.filter((player) => player !== null);

        if (disconnectedPlayersIndex.length === totalPlayers) {
            showToast("Connect player(s) to continue", "danger")
        } else {
            // Disconnect unconnected players
            disconnectedPlayersIndex.forEach((index) => {
                showToast(`Disconnecting player ${index + 1}`, "warning")
                setTimeout(() => {
                    setPlayers((prevPlayers) => {
                        return prevPlayers.filter((player) => player.playerIndex !== index);
                    });
                    disconnectGamepad(index);
                }, 2000);

                setTimeout(() => {
                    setAllPlayersConnected(true);
                }, 4000);
            });
        }

        if (disconnectedPlayersIndex.length === 0) {
            setTimeout(() => {
                setAllPlayersConnected(true);
            }, 2000);
        }
        
    };

    return (

        <Modal
            isOpen
            title={"Waiting for controller connection..."}
            subtitle={"Press the right trigger to connect"}
            alignTitle={"center"}
            alignContentCenter
            confirmLabel="Done"
            confirmLabelColorPrimary
            disableActionButtons={players.filter((player) => player.isConnected).length === 0}
            onConfirmation={handleConfirmation}
            dataId={"controller-connect-modal"}
        >
            <PlayerContainer numPlayers={players.length} dataId={"player-container"}>
                {players.map((player, index) => {
                    return (
                        <PlayerTile
                            key={index}
                            dataId={"player-tile"}
                            playerNumber={index + 1}
                            isConnected={player.isConnected}
                            src={ duck_connected }
                        />
                    );
                })}
            </PlayerContainer>

        </Modal>

    );
}
