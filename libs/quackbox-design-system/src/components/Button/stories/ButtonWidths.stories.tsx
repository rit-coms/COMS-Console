
import React from "react"
import { Meta, StoryObj } from "@storybook/react"
import { Button } from "../Button"

export default {
    title: "Components/Button/Button Widths",
    component: Button
} as Meta<typeof Button>

type Story = StoryObj<typeof Button>

export const ButtonWidths_Block: Story = {
    name: "Block",
    render: () => (
        <Button width={"block"}>
            A
        </Button>
    )
}

export const ButtonWidths_Stretch: Story = {
    name: "Stretch",
    render: () => (
        <Button width={"stretch"}>
            Stretch
        </Button>
    )
}
