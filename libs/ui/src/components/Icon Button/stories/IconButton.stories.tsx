
import { Meta, StoryObj } from "@storybook/react"
import { IconButton } from "../IconButton"

export default {
    title: "Components/Button/Button Extensions",
    component: IconButton,
    parameters: {
        controls: {exclude: ["width"]}
    },
    argTypes: {
        iconName: {control: {type: "text"}}
    }
} as Meta<typeof IconButton>

type Story = StoryObj<typeof IconButton>

export const IconButton_Default: Story = {
    name: "Icon Button",
    args: {
        iconName: "LuActivity",
        variant: "secondary",
        disabled: false
    }
}
