
import React from "react"
import { Meta, StoryObj } from "@storybook/react"
import { Modal } from "../Modal"

export default {
    title: "Components/Modal/Variants",
    component: Modal
} as Meta<typeof Modal>

type Story = StoryObj<typeof Modal>

export const ModalVariants_Default: Story = {
    name: "Default",
    render: () => (
        <Modal
            title={"Default"}
            isOpen={true}
            variant={"default"}
            onClose={() => {}}
        >
            Default children
        </Modal>
    )
}

export const ModalVariants_DefaultNoClose: Story = {
    name: "Default w/o Close Button",
    render: () => (
        <Modal
            title={"Default"}
            isOpen={true}
            variant={"default"}
        >
            Default children
        </Modal>
    )
}

export const ModalVariants_GameInfo: Story = {
    name: "Game Info",
    render: () => (
        <Modal
            title={"Game Info"}
            isOpen={true}
            variant={"gameInfo"}
            gameImageSrc={"/assets/coming_soon.png"}
            onClose={() => {}}
        >
            Game Info children
        </Modal>
    )
}

export const ModalVariants_Dialog: Story = {
    name: "Dialog",
    render: () => (
        <Modal
            title={"Dialog"}
            isOpen={true}
            variant={"dialog"}
            onClose={() => {}}
        >
            Dialog children
        </Modal>
    )
}

export const ModalVariants_DrawerLeft: Story = {
    name: "Drawer Left",
    render: () => (
        <Modal
            title={"Drawer Left"}
            isOpen={true}
            variant={"drawerLeft"}
            onClose={() => {}}
        >
            Drawer Left children
        </Modal>
    )
}

export const ModalVariants_DrawerRight: Story = {
    name: "Drawer Right",
    render: () => (
        <Modal
            title={"Drawer Right"}
            isOpen={true}
            variant={"drawerRight"}
            onClose={() => {}}
        >
            Drawer Right children
        </Modal>
    )
}
