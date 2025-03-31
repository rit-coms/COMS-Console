
import { Meta, StoryObj } from "@storybook/react"
import { Icon } from "../Icon"

export default {
    title: "Components/Icon",
    component: Icon,
    parameters: {
        controls: {exclude: ["id", "className"]}
    },
    argTypes: {
        iconName: {control: {type: "text"}},
        variant: {control: {type: "inline-radio"}}
    }
} as Meta<typeof Icon>

type Story = StoryObj<typeof Icon>

export const Icon_Default: Story = {
    name: "Default",
    args: {
        iconName: "LuALargeSmall",
        variant: "tertiary"
    }
}
