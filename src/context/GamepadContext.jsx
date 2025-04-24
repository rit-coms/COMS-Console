import React, { createContext, useEffect, useRef, useState } from "react";
import { exit } from "@tauri-apps/api/process";
import { useToastContext } from "./contexts";

const BUTTONS = {
    0: "B",
    1: "A",
    2: "Y",
    3: "X",
    4: "LEFT TRIGGER",
    5: "RIGHT TRIGGER",
    6: "LEFT TRIGGER",
    7: "RIGHT TRIGGER",
    8: "SELECT",
    9: "START",
    10: null,
    11: null,
    12: "UP",
    13: "DOWN",
    14: "LEFT",
    15: "RIGHT",
};

const KEYMAP = [
    { // MOCK PLAYER ONE BUTTONS
        "k": 0,             // MOCK B
        "l": 1,             // MOCK A
        "j": 2,             // MOCK Y
        "i": 3,             // MOCK X
        "u": 4,             // MOCK LEFT TRIGGER
        "o": 5,             // MOCK RIGHT TRIGGER
        "9": 8,             // MOCK SELECT
        "0": 9,             // MOCK START

        "ArrowUp": 12,      // MOCK DPAD UP
        "ArrowDown": 13,    // MOCK DPAD DOWN
        "ArrowLeft": 14,    // MOCK DPAD LEFT
        "ArrowRight": 15,   // MOCK DPAD RIGHT
    },
    { // MOCK PLAYER TWO BUTTONS
        "g": 0,             // MOCK B
        "h": 1,             // MOCK A
        "f": 2,             // MOCK Y
        "t": 3,             // MOCK X
        "r": 4,             // MOCK LEFT TRIGGER
        "y": 5,             // MOCK RIGHT TRIGGER
        "4": 8,             // MOCK SELECT
        "5": 9,             // MOCK START

        "w": 12,            // MOCK DPAD UP
        "s": 13,            // MOCK DPAD DOWN
        "a": 14,            // MOCK DPAD LEFT
        "d": 15,            // MOCK DPAD RIGHT
    },
];

const KILL_TAURI_PROCESS = async () => {
    await exit(1);
}

export const GamepadContext = createContext();

export const GamepadProvider = ({ children }) => {

    const [gamepads, setGamepads] = useState([]);
    const [players, setPlayers] = useState([]);
    const [pressedButton, setPressedButton] = useState({});
    const [allPlayersConnected, setAllPlayersConnected] = useState(false);
    const {showToast} = useToastContext();
    const killswitch = new Set();
    const recentlyDisconnected = useRef(new Set());
  
    useEffect(() => {

        const handleGamepadConnected = (e) => {
            setGamepads((prevGamepads) => {
                const updatedGamepads = prevGamepads.filter((gamepad) => gamepad.index !== e.gamepad.index);
                return [
                    ...updatedGamepads, 
                    {
                        index: e.gamepad.index,
                        connected: e.gamepad.connected,
                        buttons: e.gamepad.buttons.map((btn) => ({
                            pressed: btn.pressed,
                            value: btn.value,
                        }))
                    }
                ];
            });
        };

        const handleGamepadDisconnected = (e) => {
            disconnectGamepad(e.gamepad.index);
        };

        window.addEventListener("gamepadconnected", handleGamepadConnected);
        window.addEventListener("gamepaddisconnected", handleGamepadDisconnected);
        
        const intervalId = setInterval(() => {
            const gamepadsState = navigator.getGamepads();
            setGamepads((prevGamepads) =>
                prevGamepads.map((gamepad) => {
                    const currentGamepad = gamepadsState[gamepad.index];

                    if (currentGamepad) {
                        const updatedButtons = currentGamepad.buttons.map((btn, index) => {
                            const previouslyPressed = gamepad.buttons[index]?.pressed || false;
                            const isPressed = btn.pressed;

                            // Detect button press/release
                            if (isPressed && !previouslyPressed) {

                                console.log(`Button ${BUTTONS[index]} pressed by Player ${gamepad.index+1}`);
                                setPressedButton((prev) => ({
                                    ...prev,
                                    [gamepad.index]: BUTTONS[index]
                                }));
                            } 
                            // else if (!isPressed && previouslyPressed) {
                            //     console.log(`Button ${BUTTONS[index]} released by Player ${gamepad.index+1}`);
                            // }

                            return {
                                pressed: btn.pressed,
                                value: btn.value
                            };
                        });

                        return {
                            ...gamepad,
                            buttons: updatedButtons,
                        };
                    }
                    return gamepad;
                })
            );
        }, 100);
        
        return () => {
            window.removeEventListener("gamepadconnected", handleGamepadConnected);
            window.removeEventListener("gamepaddisconnected", handleGamepadDisconnected);
            clearInterval(intervalId);
        };

    });

    const disconnectGamepad = (index) => {

        if (!recentlyDisconnected.current.has(index)) {
            recentlyDisconnected.current.add(index);
            
            showToast(`Removing Player ${index + 1}`, "warning");
            setTimeout(() => {
                setGamepads((prevGamepads) => {
                    return prevGamepads.filter((gamepad) => gamepad.index !== index);
                });
                setPlayers((prevPlayers) => {
                    return prevPlayers.filter((player) => player.playerIndex !== index);
                });
            }, 1000);

        }
    };

    useEffect(() => {
        setPlayers((prevPlayers) => {
            if (prevPlayers.length > 0) {
                const updatedPlayers = [...prevPlayers];
                gamepads.forEach((gamepad, index) => {
                    // If player already exists, update index
                    if (updatedPlayers[index]) {
                        updatedPlayers[index] = { ...updatedPlayers[index], playerIndex: updatedPlayers[index].playerIndex };
                    } else {
                        // If player does not exists, add player
                        updatedPlayers.push({
                            playerIndex: gamepad.index,
                            isConnected: false
                        });
                    }
                });

                return updatedPlayers;

            } else {
                // No players connected, init player objects for all gamepads
                return gamepads.map((gamepad, index) => ({
                    playerIndex: gamepad.index,
                    isConnected: false
                }));
            }
        });

    }, [gamepads]);


    useEffect(() => {

        window.addEventListener("keydown", (event) => {
            if (event.key === "C" || event.key === "D") {
                event.preventDefault();
                
                // Create a new gamepadconnected event
                const gamepadEvent = new Event("simulatedGamepadConnected");
                gamepadEvent.gamepad = {
                    index: event.key === "C" ? 0 : 1,
                    connected: true,
                    buttons: Array(16).fill().map(() => ({
                        pressed: false,
                        value: 0
                    }))
                };
                window.dispatchEvent(gamepadEvent);
                recentlyDisconnected.current.delete(gamepadEvent.gamepad.index);
                
            } else if (event.key === "N" || event.key === "J") {
                const gamepadEvent = new Event("simulatedGamepadDisconnected");
                gamepadEvent.gamepad = {
                    index: event.key === "N" ? 0 : 1,
                    connected: false,
                    buttons: Array(16).fill().map(() => ({
                        pressed: false,
                        value: 0
                    }))
                };
                window.dispatchEvent(gamepadEvent)
            }

          });

          window.addEventListener("simulatedGamepadConnected", (e) => {
            setGamepads((prevGamepads) => {
                const updatedGamepads = prevGamepads.filter((gamepad) => gamepad.index !== e.gamepad.index);
                return [
                    ...updatedGamepads, 
                    {
                        index: e.gamepad.index,
                        connected: e.gamepad.connected,
                        buttons: e.gamepad.buttons.map((btn) => ({
                            pressed: btn.pressed,
                            value: btn.value,
                        }))
                    }
                ];
            });
          });

          window.addEventListener("simulatedGamepadDisconnected", (e) => {
            disconnectGamepad(e.gamepad.index);
          });

    });
    

    useEffect(() => {
        window.addEventListener("keydown", (event) => {

            killswitch.add(event.key)
            if (killswitch.has("Escape")) {
                KILL_TAURI_PROCESS()
                return
            }

            const playerIndex = KEYMAP[0][event.key] !== undefined ? 0 : KEYMAP[1][event.key] !== undefined ? 1 : undefined;
            if (playerIndex === undefined) return;
            
            if (KEYMAP[playerIndex][event.key] !== undefined) {
                
                event.stopImmediatePropagation();
                const buttonIndex = KEYMAP[playerIndex][event.key];
                // Only update the state if the button hasn't been pressed already
                setGamepads((prevGamepads) => {
                    return prevGamepads.map((gamepad) => {
                        if (gamepad.index === 0) { // Assuming we want to simulate player 1's gamepad
                            const updatedButtons = gamepad.buttons.map((btn, index) => {
                                if (index === buttonIndex && !btn.pressed) {
                                    return { pressed: true, value: 1 };
                                }
                                return btn;
                            });

                            return { ...gamepad, buttons: updatedButtons };
                        }
                        return gamepad;
                    });
                });

                // Optionally update the pressed button state
                setPressedButton((prev) => ({
                    ...prev,
                    [playerIndex]: BUTTONS[buttonIndex],
                }));
            }
        });

        window.addEventListener("keyup", (event) => {

            killswitch.delete(event.key)

            const playerIndex = KEYMAP[0][event.key] !== undefined ? 0 : KEYMAP[1][event.key] !== undefined ? 1 : undefined;
            if (playerIndex === undefined) return;

            if (KEYMAP[playerIndex][event.key] !== undefined) {
                event.stopImmediatePropagation();
                const buttonIndex = KEYMAP[playerIndex][event.key];
                // Only update the state if the button is currently pressed
                setGamepads((prevGamepads) => {
                    return prevGamepads.map((gamepad) => {
                        if (gamepad.index === 0) {
                            const updatedButtons = gamepad.buttons.map((btn, index) => {
                                if (index === buttonIndex && btn.pressed) {
                                    return { pressed: false, value: 0 };
                                }
                                return btn;
                            });

                            return { ...gamepad, buttons: updatedButtons };
                        }
                        return gamepad;
                    });
                });

                // Optionally update the pressed button state
                setPressedButton((prev) => ({
                    ...prev,
                    [playerIndex]: null, // Assuming button is released
                }));
            }
        });
    }, []);

    const setButtonAction = (keyOrButton, action) => {
        // if string, keyboard key, else gamepad button
        if (typeof keyOrButton === 'string') {

            const playerIndex = KEYMAP[0][keyOrButton] !== undefined ? 0 : KEYMAP[1][keyOrButton] !== undefined ? 1 : undefined;
            if (playerIndex === undefined) return;

            window.addEventListener('keydown', (event) => {
                if (KEYMAP[playerIndex][event.key] === KEYMAP[playerIndex][keyOrButton]) {
                    action(event);
                }
            });

        }
        else {
            const gamepadIndex = keyOrButton; 
            setInterval(() => {
                const currentGamepad = navigator.getGamepads()[gamepadIndex];
                if (currentGamepad) {
                    currentGamepad.buttons.forEach((btn, index) => {
                        if (btn.pressed) {
                            action(index, btn);
                        }
                    });
                }
            }, 100);    

        }
    };

  return (
    <GamepadContext.Provider value={{
        gamepads, players, setPlayers, pressedButton, 
        allPlayersConnected, setAllPlayersConnected, disconnectGamepad,
        setButtonAction
    }}>
      {children}
    </GamepadContext.Provider>
  );
};
