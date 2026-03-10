
import React from "react"
import { Meta, StoryObj } from "@storybook/react"
import { Pill } from "../Pill"

export default {
    title: "Components/Pill/Variants",
    component: Pill
} as Meta<typeof Pill>

type Story = StoryObj<typeof Pill>

export const PillVariants_Primary: Story = {
    name: "Primary",
    render: () => (
        <Pill variant={"primary"}>
            Primary
        </Pill>
    )
}

export const PillVariants_Secondary: Story = {
    name: "Secondary",
    render: () => (
        <Pill variant={"secondary"}>
            Secondary
        </Pill>
    )
}

export const PillVariants_Tertiary: Story = {
    name: "Tertiary",
    render: () => (
        <Pill variant={"tertiary"}>
            Tertiary
        </Pill>
    )
}

export const PillVariants_Text: Story = {
    name: "Text",
    render: () => (
        <Pill variant={"text"}>
            Text
        </Pill>
    )
}
