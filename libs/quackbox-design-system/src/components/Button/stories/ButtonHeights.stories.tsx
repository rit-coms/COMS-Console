
import React from "react"
import { Meta, StoryObj } from "@storybook/react"
import { Button } from "../Button"

export default {
    title: "Components/Button/Button Heights",
    component: Button
} as Meta<typeof Button>

type Story = StoryObj<typeof Button>

export const ButtonHeights_Small: Story = {
    name: "Small",
    render: () => (
        <Button height={"small"}>
            Small Button
        </Button>
    )
}

export const ButtonHeights_Medium: Story = {
    name: "Medium",
    render: () => (
        <Button height={"medium"}>
            Medium Button
        </Button>
    )
}

export const ButtonHeights_Large: Story = {
    name: "Large",
    render: () => (
        <Button height={"large"}>
            Large Button
        </Button>
    )
}
