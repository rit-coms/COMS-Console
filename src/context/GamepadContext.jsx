import { createContext, useContext, useEffect, useRef, useState } from "react";

const BUTTONS = {
    0: 'B',
    1: 'A',
    2: 'Y',
    3: 'X',
    4: 'LEFT TRIGGER',
    5: 'RIGHT TRIGGER',
    6: 'LEFT TRIGGER',
    7: 'RIGHT TRIGGER',
    8: 'SELECT',
    9: 'START',
    10: null,
    11: null,
    12: 'UP',
    13: 'DOWN',
    14: 'LEFT',
    15: 'RIGHT',
}

const KEYMAP = {
    "b": 0,             // B
    "a": 1,             // A
    "y": 2,             // Y
    "x": 3,             // X
    "L": 4,             // LEFT TRIGGER
    "R": 5,             // RIGHT TRIGGER
    
    "Escape": 8,        // SELECT
    "Enter": 9,         // START
    
    "ArrowUp": 12,      // UP
    "ArrowDown": 13,    // DOWN
    "ArrowLeft": 14,    // LEFT
    "ArrowRight": 15,   // RIGHT
    
};

const GamepadContext = createContext();

export const useGamepadContext = () => useContext(GamepadContext);

export const GamepadProvider = ({ children }) => {

    const [gamepads, setGamepads] = useState([])
    const [pressedButton, setPressedButton] = useState({})
    const [allPlayersConnected, setAllPlayersConnected] = useState(false)
  
    useEffect(() => {

        const handleGamepadConnected = (e) => {
            setGamepads((prevGamepads) => {
                const updatedGamepads = prevGamepads.filter((gamepad) => gamepad.index != e.gamepad.index)
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
                ]
            })
        }

        const handleGamepadDisconnected = (e) => {
            setGamepads((prevGamepads) =>
                prevGamepads.filter((gamepad) => gamepad.index !== e.gamepad.index)
            )
        }

        window.addEventListener("gamepadconnected", handleGamepadConnected)
        window.addEventListener("gamepaddisconnected", handleGamepadDisconnected)
        
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
                                }))
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
            window.removeEventListener("gamepadconnected", handleGamepadConnected)
            window.removeEventListener("gamepaddisconnected", handleGamepadDisconnected)
            clearInterval(intervalId)
        }

    })

    const disconnectGamepad = (index) => {
        setGamepads((prevGamepads) => {
            return prevGamepads.filter((gamepad) => gamepad.index != index)
        })
    }

    useEffect(() => {

        window.addEventListener('keydown', (event) => {
            if (event.key === 'C') {
                event.preventDefault();
            
                // Create a new gamepadconnected event
                const gamepadEvent = new Event('simulatedGamepadConnected')
                    gamepadEvent.gamepad = {
                    index: 0,
                    connected: true,
                    buttons: Array(16).fill().map(() => ({
                        pressed: false,
                        value: 0
                    }))
                }
                window.dispatchEvent(gamepadEvent);
            }
    
            if (event.key === 'D') {
                event.preventDefault();
            
                // Create a new gamepadconnected event
                const gamepadEvent = new Event('simulatedGamepadConnected')
                gamepadEvent.gamepad = {
                    index: 1,
                    connected: true,
                    buttons: Array(16).fill().map(() => ({
                        pressed: false,
                        value: 0
                    }))
                }
                window.dispatchEvent(gamepadEvent);
            }
          });

          window.addEventListener("simulatedGamepadConnected", (e) => {
            setGamepads((prevGamepads) => {
                const updatedGamepads = prevGamepads.filter((gamepad) => gamepad.index != e.gamepad.index)
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
                ]
            })
          })

    })
    

    useEffect(() => {
        window.addEventListener("keydown", (event) => {
            if (KEYMAP[event.key] !== undefined) {
                const buttonIndex = KEYMAP[event.key];
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
                    [0]: BUTTONS[buttonIndex],
                }));
            }
        });

        window.addEventListener("keyup", (event) => {
            if (KEYMAP[event.key] !== undefined) {
                const buttonIndex = KEYMAP[event.key];
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
                    [0]: null, // Assuming button is released
                }));
            }
        });
    }, []);
    

  return (
    <GamepadContext.Provider value={{gamepads, pressedButton, allPlayersConnected, setAllPlayersConnected, disconnectGamepad}}>
      {children}
    </GamepadContext.Provider>
  );
};
