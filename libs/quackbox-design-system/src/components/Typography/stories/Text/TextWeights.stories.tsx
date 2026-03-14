
import React from "react"
import { Meta, StoryObj } from "@storybook/react"
import { Text } from "../../Text/Text"

export default {
    title: "Components/Typography/Text/Weights",
    component: Text
} as Meta<typeof Text>

type Story = StoryObj<typeof Text>

export const TextWeights_Light: Story = {
    name: "Light",
    render: () => (
        <Text weight={"light"}>
            Text Weight - Light
        </Text>
    )
}

export const TextWeights_Normal: Story = {
    name: "Normal",
    render: () => (
        <Text weight={"normal"}>
            Text Weight - Normal
        </Text>
    )
}

export const TextWeights_Bold: Story = {
    name: "Bold",
    render: () => (
        <Text weight={"bold"}>
            Text Weight - Bold
        </Text>
    )
}
