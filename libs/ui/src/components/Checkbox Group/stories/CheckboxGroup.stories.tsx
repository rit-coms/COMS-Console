
import { Meta, StoryObj } from "@storybook/react"
import { CheckboxGroup } from "../CheckboxGroup"

export default {
    title: "Components/Checkbox Group",
    component: CheckboxGroup,
    parameters: {
        controls: {exclude: ["id", "className", "onChange", "options", "selectedValues"]}
    }
} as Meta<typeof CheckboxGroup>

type Story = StoryObj<typeof CheckboxGroup>

export const CheckboxGroup_Default: Story = {
    name: "Default",
    args: {
        options: [
            {label: "Option 1"},
            {label: "Option 2"},
            {label: "Option 3"}
        ],
        selectedValues: ["Option 1", "Option 2"],
        onChange: () => {},
        disabled: false
    }
}
