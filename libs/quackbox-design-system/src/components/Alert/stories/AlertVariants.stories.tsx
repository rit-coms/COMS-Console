
import React from "react"
import { Meta, StoryObj } from "@storybook/react"
import { Alert } from "../Alert"

export default {
    title: "Components/Alert/Variants",
    component: Alert
} as Meta<typeof Alert>

type Story = StoryObj<typeof Alert>

export const AlertVariants_Info: Story = {
    name: "Info",
    render: () => (
        <Alert
            message={"You are now using the controls for MAC OSX"}
            duration={300000}
            onClose={() => {}}
            variant={"info"}
        />
    )
}

export const AlertVariants_Success: Story = {
    name: "Success",
    render: () => (
        <Alert
            message={"Successfully changed theme to Dark Mode"}
            duration={300000}
            onClose={() => {}}
            variant={"success"}
        />
    )
}

export const AlertVariants_Warning: Story = {
    name: "Warning",
    render: () => (
        <Alert
            message={"Console will shut down after 2 minutes of inactivity"}
            duration={300000}
            onClose={() => {}}
            variant={"warning"}
        />
    )
}

export const AlertVariants_Danger: Story = {
    name: "Danger",
    render: () => (
        <Alert
            message={"Player 1 unexpectedly disconnected"}
            duration={300000}
            onClose={() => {}}
            variant={"danger"}
        />
    )
}
