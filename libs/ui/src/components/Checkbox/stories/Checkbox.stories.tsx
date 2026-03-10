
import { Meta, StoryObj } from "@storybook/react"
import { Checkbox } from "../Checkbox"

export default {
    title: "Components/Checkbox",
    component: Checkbox,
    parameters: {
        controls: {exclude: ["id", "className", "onChange"]}
    }
} as Meta<typeof Checkbox>

type Story = StoryObj<typeof Checkbox>

export const Checkbox_Default: Story = {
    name: "Default",
    args: {
        children: "Checkbox",
        checked: false,
        onChange: () => {},
        disabled: false
    }
}
