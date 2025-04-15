
import React from "react"
import { Meta, StoryObj } from "@storybook/react"
import { Link } from "../Link"

export default {
    title: "Components/Link/Variants",
    component: Link
} as Meta<typeof Link>

type Story = StoryObj<typeof Link>

export const LinkVariants_ButtonLink: Story = {
    name: "Button Link w/ onClick",
    render: () => (
        <Link>Button Link</Link>
    )
}

export const LinkVariants_HrefLink: Story = {
    name: "Link w/ href",
    render: () => (
        <Link href={"https://github.com/rit-coms/quackbox-design-system"}>
            <code>href</code> Link
        </Link>
    )
}
