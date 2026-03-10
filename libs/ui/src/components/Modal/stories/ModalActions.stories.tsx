
import React from "react"
import { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { Modal } from "../Modal"
import { Button } from "../../Button/Button"

export default {
    title: "Components/Modal/Actions",
    component: Modal
} as Meta<typeof Modal>

type Story = StoryObj<typeof Modal>

export const ModalActions_ConfirmationCancellation: Story = {
    name: "Confirmation and Cancellation",
    render: function ConfirmationCancellation() {

        const [openDefault, setOpenDefault] = useState<boolean>(false)
        const [openGameInfo, setOpenGameInfo] = useState<boolean>(false)
        const [openDialog, setOpenDialog] = useState<boolean>(false)
        const [openDrawerLeft, setOpenDrawerLeft] = useState<boolean>(false)
        const [openDrawerRight, setOpenDrawerRight] = useState<boolean>(false)

        return (
            <>
                <div>
                    <Button onClick={() => setOpenDefault(!openDefault)}>Open Default Modal</Button>
                    &nbsp;
                    <Button onClick={() => setOpenGameInfo(!openGameInfo)}>Open Game Info Modal</Button>
                    &nbsp;
                    <Button onClick={() => setOpenDialog(!openDialog)}>Open Dialog Modal</Button>
                    &nbsp;
                    <Button onClick={() => setOpenDrawerLeft(!openDrawerLeft)}>Open Leftside Drawer</Button>
                    &nbsp;
                    <Button onClick={() => setOpenDrawerRight(!openDrawerRight)}>Open Rightside Drawer</Button>
                </div>

                <Modal
                    title={"Default"}
                    isOpen={openDefault}
                    variant={"default"}
                    onClose={() => setOpenDefault(!openDefault)}
                    onCancellation={() => setOpenDefault(!openDefault)}
                    onConfirmation={() => setOpenDefault(!openDefault)}
                    cancelLabel={"Cancel"}
                    confirmLabel={"Save"}
                >
                    Default
                </Modal>
                <Modal
                    title={"Game Info"}
                    isOpen={openGameInfo}
                    variant={"gameInfo"}
                    onClose={() => setOpenGameInfo(!openGameInfo)}
                >
                    Game Info <br/> Confirmation and Cancellation together is not supported.
                </Modal>
                <Modal
                    title={"Dialog"}
                    isOpen={openDialog}
                    variant={"dialog"}
                    onClose={() => setOpenDialog(!openDialog)}
                    onCancellation={() => setOpenDialog(!openDialog)}
                    onConfirmation={() => setOpenDialog(!openDialog)}
                    cancelLabel={"Cancel"}
                    confirmLabel={"Save"}
                >
                    Dialog
                </Modal>
                <Modal
                    title={"Drawer Left"}
                    isOpen={openDrawerLeft}
                    variant={"drawerLeft"}
                    onClose={() => setOpenDrawerLeft(!openDrawerLeft)}
                    onCancellation={() => setOpenDrawerLeft(!openDrawerLeft)}
                    onConfirmation={() => setOpenDrawerLeft(!openDrawerLeft)}
                    cancelLabel={"Cancel"}
                    confirmLabel={"Save"}
                >
                    Drawer Left
                </Modal>
                <Modal
                    title={"Drawer Right"}
                    isOpen={openDrawerRight}
                    variant={"drawerRight"}
                    onClose={() => setOpenDrawerRight(!openDrawerRight)}
                    onCancellation={() => setOpenDrawerRight(!openDrawerRight)}
                    onConfirmation={() => setOpenDrawerRight(!openDrawerRight)}
                    cancelLabel={"Cancel"}
                    confirmLabel={"Save"}
                >
                    Drawer Right
                </Modal>
                
            </>
        )
        
    }
}

export const ModalActions_Confirmation: Story = {
    name: "Confirmation",
    render: function Confirmation() {

        const [openDefault, setOpenDefault] = useState<boolean>(false)
        const [openGameInfo, setOpenGameInfo] = useState<boolean>(false)
        const [openDialog, setOpenDialog] = useState<boolean>(false)
        const [openDrawerLeft, setOpenDrawerLeft] = useState<boolean>(false)
        const [openDrawerRight, setOpenDrawerRight] = useState<boolean>(false)

        return (
            <>
                <div>
                    <Button onClick={() => setOpenDefault(!openDefault)}>Open Default Modal</Button>
                    &nbsp;
                    <Button onClick={() => setOpenGameInfo(!openGameInfo)}>Open Game Info Modal</Button>
                    &nbsp;
                    <Button onClick={() => setOpenDialog(!openDialog)}>Open Dialog Modal</Button>
                    &nbsp;
                    <Button onClick={() => setOpenDrawerLeft(!openDrawerLeft)}>Open Leftside Drawer</Button>
                    &nbsp;
                    <Button onClick={() => setOpenDrawerRight(!openDrawerRight)}>Open Rightside Drawer</Button>
                </div>
                <Modal
                    title={"Default"}
                    isOpen={openDefault}
                    variant={"default"}
                    onClose={() => setOpenDefault(!openDefault)}
                    onConfirmation={() => setOpenDefault(!openDefault)}
                    confirmLabel={"Save"}
                >
                    Default
                </Modal>
                <Modal
                    title={"Game Info"}
                    isOpen={openGameInfo}
                    variant={"gameInfo"}
                    onClose={() => setOpenGameInfo(!openGameInfo)}
                    onConfirmation={() => setOpenGameInfo(!openGameInfo)}
                    confirmLabel={"Play"}
                >
                    Game Info
                </Modal>
                <Modal
                    title={"Dialog"}
                    isOpen={openDialog}
                    variant={"dialog"}
                    onClose={() => setOpenDialog(!openDialog)}
                    onConfirmation={() => setOpenDialog(!openDialog)}
                    confirmLabel={"Save"}
                >
                    Dialog
                </Modal>
                <Modal
                    title={"Drawer Left"}
                    isOpen={openDrawerLeft}
                    variant={"drawerLeft"}
                    onClose={() => setOpenDrawerLeft(!openDrawerLeft)}
                    onConfirmation={() => setOpenDrawerLeft(!openDrawerLeft)}
                    confirmLabel={"Save"}
                >
                    Drawer Left
                </Modal>
                <Modal
                    title={"Drawer Right"}
                    isOpen={openDrawerRight}
                    variant={"drawerRight"}
                    onClose={() => setOpenDrawerRight(!openDrawerRight)}
                    onConfirmation={() => setOpenDrawerRight(!openDrawerRight)}
                    confirmLabel={"Save"}
                >
                    Drawer Right
                </Modal>
            </>
        )
    }
}


export const ModalActions_Cancellation: Story = {
    name: "Cancellation",
    render: function Cancellation() {

        const [openDefault, setOpenDefault] = useState<boolean>(false)
        const [openGameInfo, setOpenGameInfo] = useState<boolean>(false)
        const [openDialog, setOpenDialog] = useState<boolean>(false)
        const [openDrawerLeft, setOpenDrawerLeft] = useState<boolean>(false)
        const [openDrawerRight, setOpenDrawerRight] = useState<boolean>(false)

        return (
            <>
                <div>
                    <Button onClick={() => setOpenDefault(!openDefault)}>Open Default Modal</Button>
                    &nbsp;
                    <Button onClick={() => setOpenGameInfo(!openGameInfo)}>Open Game Info Modal</Button>
                    &nbsp;
                    <Button onClick={() => setOpenDialog(!openDialog)}>Open Dialog Modal</Button>
                    &nbsp;
                    <Button onClick={() => setOpenDrawerLeft(!openDrawerLeft)}>Open Leftside Drawer</Button>
                    &nbsp;
                    <Button onClick={() => setOpenDrawerRight(!openDrawerRight)}>Open Rightside Drawer</Button>
                </div>
                <Modal
                    title={"Default"}
                    isOpen={openDefault}
                    variant={"default"}
                    onClose={() => setOpenDefault(!openDefault)}
                    onCancellation={() => setOpenDefault(!openDefault)}
                    cancelLabel={"Cancel"}
                >
                    Default
                </Modal>
                <Modal
                    title={"Game Info"}
                    isOpen={openGameInfo}
                    variant={"gameInfo"}
                    onClose={() => setOpenGameInfo(!openGameInfo)}
                >
                    Game Info <br/> Cancellation only is not supported.
                </Modal>
                <Modal
                    title={"Dialog"}
                    isOpen={openDialog}
                    variant={"dialog"}
                    onClose={() => setOpenDialog(!openDialog)}
                    onCancellation={() => setOpenDialog(!openDialog)}
                    cancelLabel={"Cancel"}
                >
                    Dialog
                </Modal>
                <Modal
                    title={"Drawer Left"}
                    isOpen={openDrawerLeft}
                    variant={"drawerLeft"}
                    onClose={() => setOpenDrawerLeft(!openDrawerLeft)}
                    onCancellation={() => setOpenDrawerLeft(!openDrawerLeft)}
                    cancelLabel={"Cancel"}
                >
                    Drawer Left
                </Modal>
                <Modal
                    title={"Drawer Right"}
                    isOpen={openDrawerRight}
                    variant={"drawerRight"}
                    onClose={() => setOpenDrawerRight(!openDrawerRight)}
                    onCancellation={() => setOpenDrawerRight(!openDrawerRight)}
                    cancelLabel={"Cancel"}
                >
                    Drawer Right
                </Modal>
            </>
        )
    }
}
