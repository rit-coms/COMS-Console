import { createContext, useEffect, useReducer, useRef, useState } from "react";
import { CurrentButton } from "../helpers/CurrentButton";

export const ControllerContext = createContext("")

export const ControllerProvider = ({ children }) => {

    const [controllers, setControllers] = useState({})
    const [isConnected, setIsConnected] = useState(false)
    const [currentButton, setCurrentButton] = useState(null)
    const [currentPlayer, setCurrentPlayer] = useState(null)

    const [, forceUpdate] = useReducer(x => x + 1, 0)

    let players = useRef({
        0: false,
        player1: null,
        1: false,
        player2: null
    })

    const addController = (controller) => {
        console.log(`Controller ${controller.index + 1} has been connected`)
        setControllers(controllers => ({
            ...controllers,
            [controller.index]: {
                buttons: controller.buttons,
                id: controller.id,
                index: controller.index,
                axes: controller.axes
            }
        }))
    }

    const deleteController = (e) => {
        console.log(`Controller ${e.index + 1} has been disconnected`)

        // set player to false and nullify its object
        players['current'][e.index] = false

        if (players['current'].player1 != null && players['current'].player1.id == e.id) {
            players['current'].player1 = null

        } else if (players['current'].player2 != null && players['current'].player2.id == e.id) {
            players['current'].player2 = null
        }

        // delete controller
        delete controllers[e.index]

        // if player 1 disconnected, reassign player 2
        if (Object.keys(controllers).length > 0 && !players.current.player1) {
            let key = Object.keys(controllers)[0]
            controllers[key].player = 1
            players.current.player1 = controllers[key]
            players.current.player2 = null
        }

        // force update due to player change
        forceUpdate()
    }

    const allControllersConnected = () => {
        if (Object.values(players.current).filter((value) => value == true).length < 1)
            return
        setIsConnected(true)
    }


    useEffect(() => {
        // controller connected
        window.addEventListener("gamepadconnected", (e) => {
            addController(e.gamepad)

            // poll for button changes
            setInterval(function () {

                let gp = navigator.getGamepads()[e.gamepad.index]
                let curr = CurrentButton(gp)
                if (curr != null) {
                    setCurrentButton(CurrentButton(gp))
                    setCurrentPlayer(gp.index + 1)
                }

            }, 200)

            // set any current button to null
            setInterval(function () {
                setCurrentButton(null)
            }, 500)

            return window.removeEventListener("gamepadconnected", null)
        })

        // controller disconnected
        window.addEventListener("gamepaddisconnected", (e) => {
            deleteController(e.gamepad)
            return window.removeEventListener("gamepaddisconnected", null)
        })

        // assign player status
        if (controllers) {
            if (currentButton && currentPlayer && !players['current'][currentPlayer - 1]) {

                (players['current'][currentPlayer - 1]) = true

                if (players['current'].player1 == null) {
                    controllers[currentPlayer - 1]['player'] = 1
                    players['current'].player1 = controllers[currentPlayer - 1]
                } else {
                    controllers[currentPlayer - 1]['player'] = 2
                    players['current'].player2 = controllers[currentPlayer - 1]
                }
            }
        }

    }, [currentButton, currentPlayer, addController, deleteController, setCurrentButton])

    // return values
    const values = {
        isConnected, currentButton, currentPlayer, controllers, players,
        allControllersConnected, deleteController
    }

    return (
        <ControllerContext.Provider value={values}>
            {children}
        </ControllerContext.Provider>
    )

}
