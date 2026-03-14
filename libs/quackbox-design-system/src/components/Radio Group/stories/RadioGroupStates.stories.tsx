
import React, { useState } from "react"
import { Meta, StoryObj } from "@storybook/react"
import { RadioGroup } from "../RadioGroup"

export default {
    title: "Components/Radio Group/States",
    component: RadioGroup
} as Meta<typeof RadioGroup>

type Story = StoryObj<typeof RadioGroup>

export const RadioGroupStates_Selected: Story = {
    name: "Selected",
    render: function Selected() {
        const [selectedValue, setSelectedValue] = useState<string>("Option 1")
        return (
            <RadioGroup
                options={[
                    {label: "Option 1"},
                    {label: "Option 2"},
                    {label: "Option 3"}
                ]}
                selectedValue={selectedValue}
                onChange={setSelectedValue}
                disabled={false}
            />
        )
    }
}

export const RadioGroupStates_DisabledSelected: Story = {
    name: "Disabled Selected",
    render: function DisabledSelected() {
        const [selectedValue, setSelectedValue] = useState<string>("Option 1")
        return (
            <RadioGroup
                options={[
                    {label: "Option 1"},
                    {label: "Option 2"},
                    {label: "Option 3"}
                ]}
                selectedValue={selectedValue}
                onChange={setSelectedValue}
                disabled={true}
            />
        )
    }
}

export const RadioGroupStates_Deselected: Story = {
    name: "Deselected",
    render: function Deselected() {
        const [selectedValue, setSelectedValue] = useState<string>("")
        return (
            <RadioGroup
                options={[
                    {label: "Option 1"},
                    {label: "Option 2"},
                    {label: "Option 3"}
                ]}
                selectedValue={selectedValue}
                onChange={setSelectedValue}
                disabled={false}
            />
        )
    }
}

export const RadioGroupStates_DisabledDeselected: Story = {
    name: "Disabled Deselected",
    render: function DisabledDeselected() {
        const [selectedValue, setSelectedValue] = useState<string>("")
        return (
            <RadioGroup
                options={[
                    {label: "Option 1"},
                    {label: "Option 2"},
                    {label: "Option 3"}
                ]}
                selectedValue={selectedValue}
                onChange={setSelectedValue}
                disabled={true}
            />
        )
    }
}
