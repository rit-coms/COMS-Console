
import React from "react"
import { Meta, StoryObj } from "@storybook/react"
import { Tab } from "../Tab"
import { Tabs } from "../Tabs"

export default {
    title: "Components/Tabs",
    component: Tabs,
    parameters: {
        controls: {exclude: ["id", "className", "children", "dataId"]}
    }
} as Meta<typeof Tabs>

type Story = StoryObj<typeof Tabs>

export const Tabs_Default: Story = {
    name: "Default",
    args: {
        children: (
            <Tab label="Lorem Ipsum">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Duis ac orci sed purus pellentesque cursus ut nec leo. 
                Phasellus at risus quis ante auctor facilisis. Fusce 
                iaculis leo eget dui finibus, volutpat tincidunt erat 
                euismod.
            </Tab>
        )
    }
}
