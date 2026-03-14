
import { Meta, StoryObj } from "@storybook/react"
import { Alert } from "../Alert"

export default {
    title: "Components/Alert",
    component: Alert,
    parameters: {
        controls: {exclude: ["id", "className", "onClose"]}
    },
    argTypes: {
        variant: {control: {type: "inline-radio"}}
    }
} as Meta<typeof Alert>

type Story = StoryObj<typeof Alert>

export const Alert_Default: Story = {
    name: "Default",
    args: {
        message: "Default Info Alert",
        duration: 30000000,
        variant: "info"
    }
}
