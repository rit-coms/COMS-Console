
import { Meta, StoryObj } from "@storybook/react"
import { RadioGroup } from "../RadioGroup"

export default {
    title: "Components/Radio Group",
    component: RadioGroup,
    parameters: {
        controls: {exclude: ["id", "className", "onChange", "options"]}
    }
} as Meta<typeof RadioGroup>

type Story = StoryObj<typeof RadioGroup>

export const RadioGroup_Default: Story = {
    name: "Default",
    args: {
        options: [
            {label: "Option 1"},
            {label: "Option 2"},
            {label: "Option 3"}
        ],
        selectedValue: "Option 1",
        onChange: () => {},
        disabled: false
    }
}
