
import React from "react"
import { Meta, StoryObj } from "@storybook/react"
import { Checkbox } from "../Checkbox"

export default {
    title: "Components/Checkbox/States",
    component: Checkbox
} as Meta<typeof Checkbox>

type Story = StoryObj<typeof Checkbox>

export const CheckboxStates_Checked: Story = {
    name: "Checked",
    render: () => (
        <Checkbox
            checked={true}
            disabled={false}
            onChange={() => {}}
        >
            Option 1
        </Checkbox>
    )
}

export const CheckboxStates_DisabledChecked: Story = {
    name: "Disabled Checked",
    render: () => (
        <Checkbox
            checked={true}
            disabled={true}
            onChange={() => {}}
        >
            Option 1
        </Checkbox>
    )
}

export const CheckboxStates_Unchecked: Story = {
    name: "Unchecked",
    render: () => (
        <Checkbox
            checked={false}
            disabled={false}
            onChange={() => {}}
        >
            Option 1
        </Checkbox>
    )
}

export const CheckboxStates_DisabledUnchecked: Story = {
    name: "Disabled Unchecked",
    render: () => (
        <Checkbox
            checked={false}
            disabled={true}
            onChange={() => {}}
        >
            Option 1
        </Checkbox>
    )
}
