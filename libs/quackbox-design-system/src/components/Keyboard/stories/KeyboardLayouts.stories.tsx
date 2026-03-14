
import React from "react"
import { Meta, StoryObj } from "@storybook/react"
import { Keyboard } from "../Keyboard"

export default {
    title: "Components/Keyboard/Layouts",
    component: Keyboard
} as Meta<typeof Keyboard>

type Story = StoryObj<typeof Keyboard>

export const KeyboardLayouts_QWERTY: Story = {
    name: "Qwerty",
    render: () => (
        <Keyboard 
            layout={"qwerty"}
            onKeyPress={() => {}}
        />
    )
}

export const KeyboardLayouts_Alpha: Story = {
    name: "Alpha",
    render: () => (
        <Keyboard 
            layout={"alpha"}
            onKeyPress={() => {}}
        />
    )
}
