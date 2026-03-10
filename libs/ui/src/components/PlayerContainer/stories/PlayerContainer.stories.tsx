
import React from "react"
import { Meta, StoryFn } from "@storybook/react"
import { PlayerContainer } from "../PlayerContainer"
import { PlayerTile } from "../../Player Tile/PlayerTile"
import { useState } from "react"

export default {
    title: "Components/Player Container",
    component: PlayerContainer,
    parameters: {
        controls: {exclude: ["id", "className", "children"]},
    },
    argTypes: {}
} as Meta<typeof PlayerContainer>

const Template: StoryFn<typeof PlayerContainer> = (args) => {

    const [playerStates, setPlayerStates] = useState<boolean[]>(
        Array(args.numPlayers).fill(false)
    )

    const handleToggle = (index: number) => {
        setPlayerStates(prevStates => {
            const newStates = [...prevStates]
            newStates[index] = !newStates[index]
            return newStates
        })
    }

    const PlayerTiles = () => {
        return (
            Array.from({length: args.numPlayers}).map((_, index) => (
                <PlayerTile
                    key={index}
                    playerNumber={index + 1}
                    isConnected={playerStates[index]}
                    src={"/assets/duck_connected.png"}
                    onToggle={() => handleToggle(index)}
                />
            ))
        )
    }

    return (
        <PlayerContainer numPlayers={args.numPlayers}>
            <PlayerTiles />
        </PlayerContainer>
    )

}

export const PlayerContainer_Default = Template.bind({})

PlayerContainer_Default.storyName = "Default"
PlayerContainer_Default.args = {
    numPlayers: 2
}
