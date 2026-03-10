
import React from "react"
import { Meta, StoryObj } from "@storybook/react"
import { Header } from "../../Header/Header"

export default {
    title: "Components/Typography/Header/Levels",
    component: Header
} as Meta<typeof Header>

type Story = StoryObj<typeof Header>

export const HeaderLevels_1: Story = {
    name: "Level 1",
    render: () => (
        <Header level={1}>
            &lt;h1&gt; Header Level 1 &lt;/h1&gt;
        </Header>
    )
}

export const HeaderLevels_2: Story = {
    name: "Level 2",
    render: () => (
        <Header level={2}>
            &lt;h2&gt; Header Level 2 &lt;/h2&gt;
        </Header>
    )
}

export const HeaderLevels_3: Story = {
    name: "Level 3",
    render: () => (
        <Header level={3}>
            &lt;h3&gt; Header Level 3 &lt;/h3&gt;
        </Header>
    )
}

export const HeaderLevels_4: Story = {
    name: "Level 4",
    render: () => (
        <Header level={4}>
            &lt;h4&gt; Header Level 4 &lt;/h4&gt;
        </Header>
    )
}

export const HeaderLevels_5: Story = {
    name: "Level 5",
    render: () => (
        <Header level={5}>
            &lt;h5&gt; Header Level 5 &lt;/h5&gt;
        </Header>
    )
}

export const HeaderLevels_6: Story = {
    name: "Level 6",
    render: () => (
        <Header level={6}>
            &lt;h6&gt; Header Level 6 &lt;/h6&gt;
        </Header>
    )
}
