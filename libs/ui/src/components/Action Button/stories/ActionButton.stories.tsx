
import React from "react"
import { Meta, StoryObj } from "@storybook/react"
import { ActionButton } from "../ActionButton"

export default {
    title: "Components/Button/Button Extensions",
    component: ActionButton
} as Meta<typeof ActionButton>

type Story = StoryObj<typeof ActionButton>

export const ActionButton_Actions: Story = {
    name: "Action Button",
    render: () => (
        <div>
            <ActionButton variant={"info"}>
                Info
            </ActionButton>
            &nbsp;
            <ActionButton variant={"success"}>
                Success
            </ActionButton>
            &nbsp;
            <ActionButton variant={"warning"}>
                Warning
            </ActionButton>
            &nbsp;
            <ActionButton variant={"danger"}>
                Danger
            </ActionButton>
        </div>
    )
}
