
import { Meta, StoryObj } from "@storybook/react"
import { Keyboard } from "../Keyboard"

export default {
    title: "Components/Keyboard",
    component: Keyboard,
    parameters: {
        controls: {exclude: ["id", "className", "onKeyPress"]}
    }
} as Meta<typeof Keyboard>

type Story = StoryObj<typeof Keyboard>

export const Keyboard_Default: Story = {
    name: "Default",
    args: {
        layout: "qwerty",
        onKeyPress: () => {}
    }
}
