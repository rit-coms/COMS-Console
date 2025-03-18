
import { useContext, useEffect, useState } from 'react'
import '../styles/ControllerConnect.css'
import { ControllerContext } from '../context/ControllerContext'
import { PageContext } from '../context/PageContext'
import { Button, Modal, PlayerContainer, PlayerTile } from 'quackbox-design-system'
import { useGamepadContext } from '../context/GamepadContext'

export default function ControllerConnectPage() {

    const { gamepads, pressedButton, setAllPlayersConnected, disconnectGamepad } = useGamepadContext()
    const [players, setPlayers] = useState([])
    const [playerFocus, setPlayerFocus] = useState({})

    const [pageElements, setPageElements] = useState({
        0: document.body.querySelectorAll("button[data-id='player-tile-label']"),
        1: document.body.querySelectorAll("button[data-id='controller-connect-modal-confirm-button']")
    })

    const updatePageElements = () => {
        setPageElements(
            {
                0: document.body.querySelectorAll("button[data-id='player-tile-label']"),
                1: document.body.querySelectorAll("button[data-id='controller-connect-modal-confirm-button']")
            }
        )
    }

    const updateFocus = (playerIndex, direction) => {

        const currentFocus = playerFocus[playerIndex]
        const updatedFocus = { ...currentFocus }
        switch (direction) {
            case "DOWN":
                updatedFocus.x = Math.min(updatedFocus.x + 1, Object.keys(pageElements).length - 1)
                updatedFocus.y = 0
                break

            case "UP":
                updatedFocus.x = Math.max(updatedFocus.x - 1, 0)
                updatedFocus.y = 0
                break

            case "RIGHT":
                updatedFocus.y = Math.min(updatedFocus.y + 1, pageElements[updatedFocus.x].length - 1)
                break

            case "LEFT":
                updatedFocus.y = Math.max(updatedFocus.y - 1, 0)
                break
        }

        setPlayerFocus((prevFocus) => ({
            ...prevFocus,
            [playerIndex]: updatedFocus
        }))
    }
    

    useEffect(() => {
        setPlayers((prevPlayers) => {
            if (prevPlayers.length > 0) {
                const updatedPlayers = [...prevPlayers];
                gamepads.forEach((gamepad, index) => {
                    if (updatedPlayers[index]) {
                        updatedPlayers[index] = { ...updatedPlayers[index], playerIndex: index };
                    } else {
                        updatedPlayers.push({
                            playerIndex: index,
                            isConnected: false
                        });
                    }
                });
                return updatedPlayers;
            } else {

                return gamepads.map((gamepad, index) => ({
                    playerIndex: index,
                    isConnected: false
                }));
            }
        });

        setPlayerFocus((prevFocus) => {
            const updatedFocus = { ...prevFocus }
            players.forEach((player, index) => {
                if (!updatedFocus[index]) {
                    updatedFocus[index] = {x: 0, y: 0}
                }
            })
            return updatedFocus
        })
    }, [gamepads]);

    useEffect(() => {
        setPlayers((prevPlayers) => {
            return prevPlayers.map((player, index) => {
                // Check when the RIGHT TRIGGER is clicked to connect player
                if (pressedButton[index] === "RIGHT TRIGGER" && !player.isConnected) {
                    updatePageElements()
                    return { ...player, isConnected: true }
                }

                return player
            })
        })
    }, [pressedButton])


    useEffect(() => {
        if (Object.keys(pressedButton).length > 0) {
            // Handle pressedButton inputs for each player
            Object.keys(pressedButton).forEach((playerIndex) => {

                if (!players[playerIndex])
                    return

                const pressed = pressedButton[playerIndex];

                if (pressed === 'UP' && players[playerIndex].isConnected) {
                    updateFocus(playerIndex, 'UP');
                } else if (pressed === 'DOWN' && players[playerIndex].isConnected) {
                    updateFocus(playerIndex, 'DOWN');
                }
                else if (pressed === 'LEFT' && players[playerIndex].isConnected) {
                    updateFocus(playerIndex, 'LEFT');
                } else if (pressed === 'RIGHT' && players[playerIndex].isConnected) {
                    updateFocus(playerIndex, 'RIGHT');
                } else if (pressed === 'A' && players[playerIndex].isConnected) {
                    clickElement(playerIndex)
                }

            });
        }
    }, [pressedButton]);

    const clickElement = (playerIndex) => {
        const element = (pageElements[playerFocus[playerIndex].x][playerFocus[playerIndex].y])
        element.click()
    }

    const focusElement = (element) => {
        element.style.outline = "2px solid black"
    }

    const clearFocus = () => {
        Object.values(pageElements).forEach((group) => {
            group.forEach((element) => {
                element.style.outline = ""
            })
        })
    }

      
    useEffect(() => {

        players.forEach((player, index) => {

            if (!players[index].isConnected || !playerFocus[index])
                return

            const x = playerFocus[index].x
            const y = playerFocus[index].y
            clearFocus()
            const currentElement = pageElements[x][y]
            
            focusElement(currentElement)
        })

    }, [playerFocus, pageElements])

    const handleConfirmation = () => {

        if (players.length <= 0)
            return

        const totalPlayers = players.length
        const disconnectedPlayers = (players.map((player) => !player.isConnected ? player.playerIndex : null))
        const disconnectedPlayersIndex = disconnectedPlayers.filter((player) => player != null)

        if (disconnectedPlayersIndex.length == totalPlayers) {
            // Cannot continue without connected players (toast warn?)
        } else {
            // Disconnect unconnected players
            disconnectedPlayersIndex.forEach((index) => {
                console.log(`Disconnecting Player ${index + 1}`)
                
                setTimeout(() => {
                    setPlayers((prevPlayers) => {
                        return prevPlayers.filter((player) => player.playerIndex != index)
                    })
                    disconnectGamepad(index)
                }, 1500)

                setTimeout(() => {
                    setAllPlayersConnected(true)
                }, 2500)
            })
        }

        if (disconnectedPlayersIndex.length == 0) {
            setAllPlayersConnected(true)
        }
        
    }

    return (
        <Modal
            isOpen
            title={"Waiting for controller connection..."}
            subtitle={"Press the right trigger to connect"}
            alignTitle={"center"}
            alignContentCenter
            confirmLabel="Done"
            confirmLabelColorPrimary
            onConfirmation={handleConfirmation}
            dataId={"controller-connect-modal"}
        >
            <PlayerContainer numPlayers={players.length} dataId={"player-container"}>
                {players.map((player, index) => {
                    return (
                        <PlayerTile
                            key={index}
                            dataId={`player-tile`}
                            playerNumber={index + 1}
                            isConnected={player.isConnected}
                            src={"src/assets/duck_connected.png"}
                        />
                    )
                })}
            </PlayerContainer>

        </Modal>

    )
}
