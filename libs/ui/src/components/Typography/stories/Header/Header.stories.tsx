
import { Meta, StoryObj } from "@storybook/react"
import { Header } from "../../Header/Header"

export default {
    title: "Components/Typography/Header",
    component: Header,
    parameters: {
        controls: {exclude: ["id", "className"]}
    },
    argTypes: {
        children: {control: {type: "text"}},
        fontSize: {control: {type: "inline-radio"}},
        weight: {control: {type: "inline-radio"}}
    }
} as Meta<typeof Header>

type Story = StoryObj<typeof Header>

export const Header_Default: Story = {
    name: "Default",
    args: {
        children: "Header",
        level: 2,
        weight: "normal",
        fontSize: "default"
    }
}
