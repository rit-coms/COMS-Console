
import { Meta, StoryObj } from "@storybook/react"
import { Pill } from "../Pill"

export default {
    title: "Components/Pill",
    component: Pill,
    parameters: {
        controls: {exclude: ["id", "className"]}
    },
    argTypes: {
        label: {control: {type: "text"}},
        variant: {control: {type: "inline-radio"}},
        size: {control: {type: "inline-radio"}}
    }
} as Meta<typeof Pill>

type Story = StoryObj<typeof Pill>

export const Pill_Default: Story = {
    name: "Default",
    args: {
        children: "Pill",
        variant: "primary",
        size: "small"
    }
}
