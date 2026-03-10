
import React from "react"
import { Meta, StoryObj } from "@storybook/react"
import { Caret } from "../Caret"

export default {
    title: "Components/Caret/Directions",
    component: Caret
} as Meta<typeof Caret>

type Story = StoryObj<typeof Caret>

export const CaretDirections_Left: Story = {
    name: "Left",
    render: () => (
        <Caret
            direction={"left"}
            onClick={() => {}}
        />
    )
}

export const CaretDirections_Right: Story = {
    name: "Right",
    render: () => (
        <Caret
            direction={"right"}
            onClick={() => {}}
        />
    )
}
