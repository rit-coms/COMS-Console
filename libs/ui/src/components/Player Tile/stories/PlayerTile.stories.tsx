
import { Meta, StoryObj } from "@storybook/react"
import { PlayerTile } from "../PlayerTile"

export default {
    title: "Components/Player Tile",
    component: PlayerTile,
    parameters: {
        controls: {exclude: ["id", "className", "onToggle"]}
    },
    argTypes: {}
} as Meta<typeof PlayerTile>

type Story = StoryObj<typeof PlayerTile>

export const PlayerTile_Default: Story = {
    name: "Default",
    args: {
        playerNumber: 1,
        isConnected: false,
        src: "/assets/duck_connected.png",
        onToggle: () => {}
    }
}
