
import { Meta, StoryObj } from "@storybook/react"
import { Radio } from "../Radio"

export default {
    title: "Components/Radio",
    component: Radio,
    parameters: {
        controls: {exclude: ["id", "className", "onChange"]}
    }
} as Meta<typeof Radio>

type Story = StoryObj<typeof Radio>

export const Radio_Default: Story = {
    name: "Default",
    args: {
        children: "Option 1",
        selected: true,
        disabled: false,
        onChange: () => {}
    }
}
