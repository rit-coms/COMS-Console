
import React, { useState } from "react"
import { Meta, StoryFn } from "@storybook/react"
import { PlayerContainer } from "../PlayerContainer"
import { PlayerTile } from "../../Player Tile/PlayerTile"

export default {
    title: "Components/Player Container/Layouts",
    component: PlayerContainer
} as Meta<typeof PlayerContainer>

const Template_Row: StoryFn<typeof PlayerContainer> = () => {

    const [playerStates, setPlayerStates] = useState<boolean[]>(
        Array(2).fill(false)
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
            Array.from({length: 2}).map((_, index) => (
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
        <PlayerContainer numPlayers={2}>
            <PlayerTiles />
        </PlayerContainer>
    )

}

const Template_Grid: StoryFn<typeof PlayerContainer> = () => {

    const [playerStates, setPlayerStates] = useState<boolean[]>(
        Array(8).fill(false)
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
            Array.from({length: 8}).map((_, index) => (
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
        <PlayerContainer numPlayers={8}>
            <PlayerTiles />
        </PlayerContainer>
    )

}

export const PlayerContainerLayouts_Row = Template_Row.bind({})
PlayerContainerLayouts_Row.storyName = "Row"

export const PlayerContainerLayouts_Grid = Template_Grid.bind({})
PlayerContainerLayouts_Grid.storyName = "Grid"
