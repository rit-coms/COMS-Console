
import React from "react"
import { Meta, StoryObj } from "@storybook/react"
import { Button } from "../../Button/Button"
import { ButtonGroup } from "../ButtonGroup"

export default {
    title: "Components/Button Group/Directions",
    component: ButtonGroup
} as Meta<typeof ButtonGroup>

type Story = StoryObj<typeof ButtonGroup>

export const ButtonGroupDirections_Row: Story = {
    name: "Row",
    render: () => (
        <ButtonGroup direction={"row"}>
            <Button>One</Button>
            <Button>Two</Button>
            <Button>Three</Button>
        </ButtonGroup>
    )
}

export const ButtonGroupDirections_Column: Story = {
    name: "Column",
    render: () => (
        <ButtonGroup direction={"column"}>
            <Button>One</Button>
            <Button>Two</Button>
            <Button>Three</Button>
        </ButtonGroup>
    )
}
