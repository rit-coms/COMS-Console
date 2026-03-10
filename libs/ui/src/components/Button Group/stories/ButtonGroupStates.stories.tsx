
import React from "react"
import { Meta, StoryObj } from "@storybook/react"
import { Button } from "../../Button/Button"
import { ButtonGroup } from "../ButtonGroup"

export default {
    title: "Components/Button Group/States",
    component: ButtonGroup
} as Meta<typeof ButtonGroup>

type Story = StoryObj<typeof ButtonGroup>

export const ButtonGroupStates_Enabled: Story = {
    name: "Enabled",
    render: () => (
        <ButtonGroup>
            <Button>One</Button>
            <Button>Two</Button>
            <Button>Three</Button>
        </ButtonGroup>
    )
}

export const ButtonGroupStates_Disabled: Story = {
    name: "Disabled",
    render: () => (
        <ButtonGroup disabled>
            <Button>One</Button>
            <Button>Two</Button>
            <Button>Three</Button>
        </ButtonGroup>
    )
}
