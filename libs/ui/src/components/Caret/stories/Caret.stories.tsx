
import { Meta, StoryObj } from "@storybook/react"
import { Caret } from "../Caret"

export default {
    title: "Components/Caret",
    component: Caret,
    parameters: {
        controls: {exclude: ["id", "className", "onClick"]}
    },
    argTypes: {
        size: {control: {type: "text"}},
        direction: {control: {type: "inline-radio"}}
    }
} as Meta<typeof Caret>

type Story = StoryObj<typeof Caret>

export const Caret_Default: Story = {
    name: "Default",
    args: {
        size: "5em",
        direction: "left",
        disabled: false,
        color: "#99D6DE",
        strokeWidth: 4
    }
}
