
import React from "react"
import { Meta, StoryObj } from "@storybook/react"
import { Text } from "../../Text/Text"

export default {
    title: "Components/Typography/Text/As Element",
    component: Text
} as Meta<typeof Text>

type Story = StoryObj<typeof Text>

export const TextAs_P: Story = {
    name: "p",
    render: () => (
        <Text as={"p"}>
            &lt;p&gt; Text &lt;/p&gt;
        </Text>
    )
}

export const TextAs_Span: Story = {
    name: "span",
    render: () => (
        <Text as={"span"}>
            &lt;span&gt; Text &lt;/span&gt;
        </Text>
    )
}
