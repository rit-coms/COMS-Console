
import { Meta, StoryObj } from "@storybook/react"
import { Game } from "../Game"

export default {
    title: "Components/Game",
    component: Game,
    parameters: {
        controls: {exclude: ["id", "className", "onClick"]}
    },
    argTypes: {
        fontSize: {control: {type: "inline-radio"}},
    }
} as Meta<typeof Game>

type Story = StoryObj<typeof Game>

export const Game_Default: Story = {
    name: "Default",
    args: {
        title: "Horizon",
        fontSize: "xlarge",
        imageUrl: "/assets/horizon.png",
        placeholder: false,
        onClick: () => {}
    }
}
