
import React from "react"
import { Meta, StoryObj } from "@storybook/react"
import { Header } from "../../Header/Header"

export default {
    title: "Components/Typography/Header/Font Sizes",
    component: Header
} as Meta<typeof Header>

type Story = StoryObj<typeof Header>

export const HeaderFontSizes_Small: Story = {
    name: "Small",
    render: () => (
        <Header fontSize={"small"}>
            Header - Font Size Small
        </Header>
    )
}

export const HeaderFontSizes_Default: Story = {
    name: "Default",
    render: () => (
        <Header fontSize={"default"}>
            Header - Font Size Default
        </Header>
    )
}

export const HeaderFontSizes_Medium: Story = {
    name: "Medium",
    render: () => (
        <Header fontSize={"medium"}>
            Header - Font Size Medium
        </Header>
    )
}

export const HeaderFontSizes_Large: Story = {
    name: "Large",
    render: () => (
        <Header fontSize={"large"}>
            Header - Font Size Large
        </Header>
    )
}

export const HeaderFontSizes_XLarge: Story = {
    name: "X Large",
    render: () => (
        <Header fontSize={"xlarge"}>
            Header - Font Size X Large
        </Header>
    )
}
