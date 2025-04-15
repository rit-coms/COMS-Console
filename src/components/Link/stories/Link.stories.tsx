
import { Meta, StoryObj } from "@storybook/react"
import { Link } from "../Link"

export default {
    title: "Components/Link",
    component: Link,
    parameters: {
        controls: {exclude: ["id", "className", "dataId", "onClick"]}
    },
    argTypes: {
        fontSize: {control: {type: "inline-radio"}},
        target: {control: {type: "inline-radio"}},
        weight: {control: {type: "inline-radio"}}
    }
} as Meta<typeof Link>

type Story = StoryObj<typeof Link>

export const Link_Default: Story = {
    name: "Default",
    args: {
        children: "Link",
        fontSize: "auto",
        href: "",
        target: "_self",
        weight: "normal"
    }
}
