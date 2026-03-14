
import React from "react"
import { Meta, StoryObj } from "@storybook/react"
import { Toast } from "../Toast"

export default {
    title: "Components/Toast/Icons",
    component: Toast
} as Meta<typeof Toast>

type Story = StoryObj<typeof Toast>

export const ToastIcons_ToastNoIcon: Story = {
    name: "Toast w/o Icon",
    render: () => (
        <Toast 
            message={"Info Toast without Icon"}
            position={"top-left"}
            variant={"info"}
            duration={30000000}
        />
    )
}

export const ToastIcons_ToastWithIcon: Story = {
    name: "Toast with Icon",
    render: () => (
        <Toast 
            message={"Info Toast with Icon"}
            position={"top-left"}
            iconSrc={"/assets/duck.png"}
            variant={"info"}
            duration={30000000}
        />
    )
}
