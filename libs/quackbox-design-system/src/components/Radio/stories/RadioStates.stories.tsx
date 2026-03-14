
import React from "react"
import { Meta, StoryObj } from "@storybook/react"
import { Radio } from "../Radio"

export default {
    title: "Components/Radio/States",
    component: Radio
} as Meta<typeof Radio>

type Story = StoryObj<typeof Radio>

export const RadioStates_Selected: Story = {
    name: "Selected",
    render: () => (
        <Radio
            selected={true}
            disabled={false}
            onChange={() => {}}
        >
            Option 1
        </Radio>
    )
}

export const RadioStates_DisabledSelected: Story = {
    name: "Disabled Selected",
    render: () => (
        <Radio
            selected={true}
            disabled={true}
            onChange={() => {}}
        >
            Option 1
        </Radio>
    )
}

export const RadioStates_Unselected: Story = {
    name: "Unselected",
    render: () => (
        <Radio
            selected={false}
            disabled={false}
            onChange={() => {}}
        >
            Option 1
        </Radio>
    )
}

export const RadioStates_DisabledUnselected: Story = {
    name: "Disabled Unselected",
    render: () => (
        <Radio
            selected={false}
            disabled={true}
            onChange={() => {}}
        >
            Option 1
        </Radio>
    )
}
