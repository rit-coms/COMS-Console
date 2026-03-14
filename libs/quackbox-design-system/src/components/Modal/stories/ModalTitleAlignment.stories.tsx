
import React from "react"
import { Meta, StoryObj } from "@storybook/react"
import { Modal } from "../Modal"

export default {
    title: "Components/Modal/Title Alignment",
    component: Modal
} as Meta<typeof Modal>

type Story = StoryObj<typeof Modal>

export const ModalTitleAlignment_Left: Story = {
    name: "Left Alignment",
    render: () => (
        <Modal
            title={"Left"}
            alignTitle={"left"}
            isOpen={true}
            onClose={() => {}}
        >
            Modal children
        </Modal>
    )
}

export const ModalTitleAlignment_Center: Story = {
    name: "Center Alignment",
    render: () => (
        <Modal
            title={"Center"}
            alignTitle={"center"}
            isOpen={true}
            onClose={() => {}}
        >
            Modal children
        </Modal>
    )
}

export const ModalTitleAlignment_Right: Story = {
    name: "Right Alignment",
    render: () => (
        <Modal
            title={"Right"}
            alignTitle={"right"}
            isOpen={true}
        >
            Modal children
        </Modal>
    )
}
