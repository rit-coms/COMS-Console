
import React from "react"
import { Meta, StoryObj } from "@storybook/react"
import { Modal } from "../Modal"

export default {
    title: "Components/Modal/Overlay",
    component: Modal
} as Meta<typeof Modal>

type Story = StoryObj<typeof Modal>

export const ModalOverlay_Default: Story = {
    name: "Overlay",
    render: () => (
        <Modal
            title={"Default"}
            isOpen={true}
            variant={"default"}
            overlay={false}
            onClose={() => {}}
        >
            Default children
        </Modal>
    )
}

export const ModalOverlay_NoOverlay: Story = {
    name: "No Overlay",
    render: () => (
        <Modal
            title={"Default"}
            isOpen={true}
            variant={"default"}
            overlay={true}
            onClose={() => {}}
        >
            Default children
        </Modal>
    )
}
