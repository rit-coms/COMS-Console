
import React from "react"
import { Meta, StoryObj } from "@storybook/react"
import { PlayerTile } from "../PlayerTile"

export default {
    title: "Components/Player Tile/States",
    component: PlayerTile
} as Meta<typeof PlayerTile>

type Story = StoryObj<typeof PlayerTile>

export const PlayerTileStates_NotConnected: Story = {
    name: "Not Connected",
    render: () => (
        <PlayerTile
            playerNumber={1}
            isConnected={false}
            src={"/assets/duck_connected.png"}
            onToggle={() => {}}
        />
    )
}

export const PlayerTileStates_Connected: Story = {
    name: "Connected",
    render: () => (
        <PlayerTile
            playerNumber={1}
            isConnected={true}
            src={"/assets/duck_connected.png"}
            onToggle={() => {}}
        />
    )
}
