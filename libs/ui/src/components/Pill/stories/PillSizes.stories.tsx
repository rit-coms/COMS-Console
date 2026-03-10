
import React from "react"
import { Meta, StoryObj } from "@storybook/react"
import { Pill } from "../Pill"

export default {
    title: "Components/Pill/Sizes",
    component: Pill
} as Meta<typeof Pill>

type Story = StoryObj<typeof Pill>

export const PillSizes_Small: Story = {
    name: "Small",
    render: () => (
        <Pill size={"small"}>
            Small
        </Pill>
    )
}

export const PillSizes_Medium: Story = {
    name: "Medium",
    render: () => (
        <Pill size={"medium"}>
            Medium
        </Pill>
    )
}

export const PillSizes_Large: Story = {
    name: "Large",
    render: () => (
        <Pill size={"large"}>
            Large
        </Pill>
    )
}

export const PillSizes_XLarge: Story = {
    name: "X Large",
    render: () => (
        <Pill size={"xlarge"}>
            X Large
        </Pill>
    )
}
