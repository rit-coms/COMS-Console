
import React, { useState } from "react"
import { Meta, StoryObj } from "@storybook/react"
import { CheckboxGroup } from "../CheckboxGroup"

export default {
    title: "Components/Checkbox Group/States",
    component: CheckboxGroup
} as Meta<typeof CheckboxGroup>

type Story = StoryObj<typeof CheckboxGroup>

export const CheckboxGroupStates_Checked: Story = {
    name: "Checked",
    render: function Checked() {
        const [selectedItems, setSelectedItems] = useState<string[]>(["Option 1"])
        return (
            <CheckboxGroup
                options={[
                    {label: "Option 1"},
                    {label: "Option 2"},
                    {label: "Option 3"}
                ]}
                selectedValues={selectedItems}
                onChange={() => setSelectedItems}
                disabled={false}
            />
        )
    }
}

export const CheckboxGroupStates_DisabledChecked: Story = {
    name: "Disabled Checked",
    render: function DisabledChecked() {
        const [selectedItems, setSelectedItems] = useState<string[]>(["Option 1"])
        return (
            <CheckboxGroup
                options={[
                    {label: "Option 1"},
                    {label: "Option 2"},
                    {label: "Option 3"}
                ]}
                selectedValues={selectedItems}
                onChange={() => setSelectedItems}
                disabled={true}
            />
        )
    }
}

export const CheckboxGroupStates_Unchecked: Story = {
    name: "Unchecked",
    render: function Unchecked() {
        const [selectedItems, setSelectedItems] = useState<string[]>([])
        return (
            <CheckboxGroup
                options={[
                    {label: "Option 1"},
                    {label: "Option 2"},
                    {label: "Option 3"}
                ]}
                selectedValues={selectedItems}
                onChange={() => setSelectedItems}
                disabled={false}
            />
        )
    }
}

export const CheckboxGroupStates_DisabledUnchecked: Story = {
    name: "Disabled Unchecked",
    render: function DisabledUnchecked() {
        const [selectedItems, setSelectedItems] = useState<string[]>([])
        return (
            <CheckboxGroup
                options={[
                    {label: "Option 1"},
                    {label: "Option 2"},
                    {label: "Option 3"}
                ]}
                selectedValues={selectedItems}
                onChange={() => setSelectedItems}
                disabled={true}
            />
        )
    }
}
