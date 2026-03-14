
import { Meta, StoryObj } from "@storybook/react"
import { Logo } from "../Logo"

export default {
    title: "Components/Logo",
    component: Logo,
    parameters: {
        controls: {exclude: ["id", "className"]}
    },
    argTypes: {
        variant: {control: {type: "inline-radio"}}
    }
} as Meta<typeof Logo>

type Story = StoryObj<typeof Logo>

export const Logo_Default: Story = {
    name: "Default",
    args: {
        src: "/assets/duck.png",
        variant: "default"
    }
}
