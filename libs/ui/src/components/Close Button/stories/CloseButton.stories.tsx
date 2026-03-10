
import { Meta, StoryObj } from "@storybook/react"
import { CloseButton } from "../CloseButton"

export default {
    title: "Components/Button/Button Extensions",
    component: CloseButton,
    parameters: {
        controls: {exclude: ["id", "className", "children", "iconName", "variant", "width"]}
    },
    argTypes: {
        position: {control: {type: "select"}}
    }
} as Meta<typeof CloseButton>

type Story = StoryObj<typeof CloseButton>

export const CloseButton_Default: Story = {
    name: "Close Button",
    args: {
        position: "top-right",
        disabled: false,
        height: "medium"
    }
}
