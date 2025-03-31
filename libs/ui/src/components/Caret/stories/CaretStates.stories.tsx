
import React from "react"
import { Meta, StoryObj } from "@storybook/react"
import { Caret } from "../Caret"

export default {
    title: "Components/Caret/States",
    component: Caret
} as Meta<typeof Caret>

type Story = StoryObj<typeof Caret>

export const CaretStates_Enabled: Story = {
    name: "Enabled",
    render: () => {
        return (
            <div style={{display: "flex"}}>
                <Caret direction={"left"} />
                <Caret direction={"right"} />
            </div>
        )
    }
}

export const CaretStates_Disabled: Story = {
    name: "Disabled",
    render: () => {
        return (
            <div style={{display: "flex"}}>
                <Caret direction={"left"} disabled />
                <Caret direction={"right"} disabled />
            </div>
        )
    }
}
