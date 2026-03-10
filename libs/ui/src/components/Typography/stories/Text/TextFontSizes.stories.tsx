
import React from "react"
import { Meta, StoryObj } from "@storybook/react"
import { Text } from "../../Text/Text"

export default {
    title: "Components/Typography/Text/Font Sizes",
    component: Text
} as Meta<typeof Text>

type Story = StoryObj<typeof Text>

export const TextFontSizes_Small: Story = {
    name: "Small",
    render: () => (
        <Text fontSize={"small"}>
            Text - Font Size Small
        </Text>
    )
}

export const TextFontSizes_Default: Story = {
    name: "Default",
    render: () => (
        <Text fontSize={"default"}>
            Text - Font Size Default
        </Text>
    )
}

export const TextFontSizes_Medium: Story = {
    name: "Medium",
    render: () => (
        <Text fontSize={"medium"}>
            Text - Font Size Medium
        </Text>
    )
}

export const TextFontSizes_Large: Story = {
    name: "Large",
    render: () => (
        <Text fontSize={"large"}>
            Text - Font Size Large
        </Text>
    )
}

export const TextFontSizes_XLarge: Story = {
    name: "X Large",
    render: () => (
        <Text fontSize={"xlarge"}>
            Text - Font Size X Large
        </Text>
    )
}
