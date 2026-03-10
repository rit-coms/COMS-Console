
import { Meta, StoryObj } from "@storybook/react"
import { Toast } from "../Toast"

export default {
    title: "Components/Toast",
    component: Toast,
    parameters: {
        controls: {exclude: ["id", "className"]}
    },
    argTypes: {
        position: {control: {type: "inline-radio"}},
        variant: {control: {type: "inline-radio"}}
    }
} as Meta<typeof Toast>

type Story = StoryObj<typeof Toast>

export const Toast_Default: Story = {
    name: "Default",
    args: {
        message: "Player 1 successfully connected",
        position: "top-left",
        iconSrc: "/assets/duck.png",
        variant: "info",
        duration: 30000000,
    }
}
