
import React from "react"
import { Meta, StoryObj } from "@storybook/react"
import { Button } from "../Button"

export default {
    title: "Components/Button/Button Variants",
    component: Button 
} as Meta<typeof Button>

type Story = StoryObj<typeof Button>

export const ButtonVariants_Primary: Story = {
    name: "Primary",
    render: () => (
        <Button>Primary Button</Button>
    )
}

export const ButtonVariants_Secondary: Story = {
    name: "Secondary",
    render: () => (
        <Button variant={"secondary"}>
            Secondary Button
        </Button>
    )
}

export const ButtonVariants_Tertiary: Story = {
    name: "Tertiary",
    render: () => (
        <Button variant={"tertiary"}>
            Tertiary Button
        </Button>
    )
}

export const ButtonVariants_Text: Story = {
    name: "Text",
    render: () => (
        <Button variant={"text"}>
            Text Button
        </Button>
    )
}
