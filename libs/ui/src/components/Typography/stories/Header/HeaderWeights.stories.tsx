
import React from "react"
import { Meta, StoryObj } from "@storybook/react"
import { Header } from "../../Header/Header"

export default {
    title: "Components/Typography/Header/Weights",
    component: Header
} as Meta<typeof Header>

type Story = StoryObj<typeof Header>

export const HeaderWeights_Light: Story = {
    name: "Light",
    render: () => (
        <Header weight={"light"}>
            Header Weight - Light
        </Header>
    )
}

export const HeaderWeights_Normal: Story = {
    name: "Normal",
    render: () => (
        <Header weight={"normal"}>
            Header Weight - Normal
        </Header>
    )
}

export const HeaderWeights_Bold: Story = {
    name: "Bold",
    render: () => (
        <Header weight={"bold"}>
            Header Weight - Bold
        </Header>
    )
}
