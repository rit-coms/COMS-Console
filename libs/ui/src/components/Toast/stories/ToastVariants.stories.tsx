
import React from "react"
import { Meta, StoryObj } from "@storybook/react"
import { Toast } from "../Toast"

export default {
    title: "Components/Toast/Variants",
    component: Toast
} as Meta<typeof Toast>

type Story = StoryObj<typeof Toast>

export const ToastVariants_Info: Story = {
    name: "Info",
    render: () => (
        <Toast 
            message={"Player with SNES controllers"}
            position={"top-left"}
            iconSrc={"/assets/duck.png"}
            variant={"info"}
            duration={30000000}
        />
    )
}

export const ToastVariants_Success: Story = {
    name: "Success",
    render: () => (
        <Toast 
            message={"Player 1 successfully connected"}
            position={"top-left"}
            iconSrc={"/assets/duck.png"}
            variant={"success"}
            duration={30000000}
        />
    )
}

export const ToastVariants_Warning: Story = {
    name: "Warning",
    render: () => (
        <Toast 
            message={"Player 1 battery low"}
            position={"top-left"}
            iconSrc={"/assets/duck.png"}
            variant={"warning"}
            duration={30000000}
        />
    )
}

export const ToastVariants_Danger: Story = {
    name: "Danger",
    render: () => (
        <Toast 
            message={"Player 1 disconnected"}
            position={"top-left"}
            iconSrc={"/assets/duck.png"}
            variant={"danger"}
            duration={30000000}
        />
    )
}
