
import React from "react"
import { Meta, StoryObj } from "@storybook/react"
import { Tab } from "../Tab"
import { Tabs } from "../Tabs"

export default {
    title: "Components/Tabs/Variants",
    component: Tabs
} as Meta<typeof Tabs>

type Story = StoryObj<typeof Tabs>

export const TabsVariants_Enabled: Story = {
    name: "Enabled",
    render: () => {
        return (
            <Tabs>
                <Tab label={"Enabled Tab"}>Enabled</Tab>
            </Tabs>
        )
    }
}

export const TabsVariants_Disabled: Story = {
    name: "Disabled",
    render: () => {
        return (
            <Tabs>
                <Tab disabled label={"Disabled Tab"}>Disabled</Tab>
            </Tabs>
        )
    }
}
