
import React from "react"
import { Meta, StoryObj } from "@storybook/react"
import { Button } from "../Button"

export default {
    title: "Components/Button/Button States",
    component: Button
} as Meta<typeof Button>

type Story = StoryObj<typeof Button>

export const ButtonStates_Enabled: Story = {
    name: "Enabled",
    render: () => (
        <div>
            <Button variant={"primary"}>Primary Button</Button>
            &nbsp;
            <Button variant={"secondary"}>Secondary Button</Button>
            &nbsp;
            <Button variant={"tertiary"}>Tertiary Button</Button>
            &nbsp;
            <Button variant={"text"}>Text Button</Button>
        </div>
    )
}

export const ButtonStates_Disabled: Story = {
    name: "Disabled",
    render: () => (
        <div>
            <Button variant={"primary"} disabled>Primary Button</Button>
            &nbsp;
            <Button variant={"secondary"} disabled>Secondary Button</Button>
            &nbsp;
            <Button variant={"tertiary"} disabled>Tertiary Button</Button>
            &nbsp;
            <Button variant={"text"} disabled>Text Button</Button>
        </div>
    )
}
