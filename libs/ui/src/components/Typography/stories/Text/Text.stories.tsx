
import { Meta, StoryObj } from "@storybook/react"
import { Text } from "../../Text/Text"

export default {
    title: "Components/Typography/Text",
    component: Text,
    parameters: {
        controls: {exclude: ["id", "className"]}
    },
    argTypes: {
        children: {control: {type: "text"}},
        as: {control: {type: "text"}},
        fontSize: {control: {type: "inline-radio"}},
        weight: {control: {type: "inline-radio"}}
    }
} as Meta<typeof Text>

type Story = StoryObj<typeof Text>

export const Text_Default: Story = {
    name: "Default",
    args: {
        children: "Text",
        as: "p",
        weight: "normal",
        fontSize: "auto"
    }
}
