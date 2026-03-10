
import { Meta, StoryObj } from "@storybook/react"
import { Button } from "../Button"

export default {
    title: "Components/Button",
    component: Button,
    parameters: {
        controls: {exclude: ["id", "className", "onClick"]}
    },
    argTypes: {
        children: {control: {type: "text"}},
        height: {control: {type: "inline-radio"}},
        variant: {options: ["primary", "secondary", "tertiary", "text"]},
        width: {control: {type: "inline-radio"}}
    }
} as Meta<typeof Button>

type Story = StoryObj<typeof Button>

export const Button_Default: Story = {
    name: "Default",
    args: {
        children: "Button",
        disabled: false,
        variant: "primary",
        width: "stretch"
    }
}
