
import { Meta, StoryObj } from "@storybook/react"
import { Modal } from "../Modal"

export default {
    title: "Components/Modal",
    component: Modal,
    parameters: {
        controls: {exclude: ["id", "className", "onClose", "onCancellation", "onConfirmation"]},
        layout: "fullscreen"
    },
    argTypes: {
        children: {control: {type: "text"}},
        title: {control: {type: "text"}},
        variant: {control: {type: "select"}},
        alignTitle: {control: {type: "inline-radio"}}
    }
} as Meta<typeof Modal>

type Story = StoryObj<typeof Modal>

export const Modal_Default: Story = {
    name: "Default",
    args: {
        children: "Content",
        isOpen: true,
        title: "Modal",
        onClose: () => {},
        variant: "default",
        overlay: true,
        confirmLabel: "Save",
        cancelLabel: "Exit",
        alignContentCenter: false,
        alignTitle: "left"
    }
}
