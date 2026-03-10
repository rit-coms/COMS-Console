
import { ReactNode } from "react"
import { BaseProps } from "../../types"
import { ActionButton } from "../Action Button/ActionButton"
import { ButtonGroup } from "../Button Group/ButtonGroup"
import { CloseButton } from "../Close Button/CloseButton"
import { Header } from "../Typography/Header/Header"
import styles from "./Modal.module.css"

interface ModalProps extends BaseProps {
    
    // Content Props
    children: ReactNode
    cancelLabel?: string
    confirmLabel?: string
    isOpen: boolean
    title?: string | ReactNode

    // Action Props
    onCancellation?: () => void
    onClose?: () => void 
    onConfirmation?: () => void
    
    // Styling Props
    alignTitle?: "left" | "center" | "right"
    variant?: "default" | "gameInfo" | "dialog" | "drawerLeft" | "drawerRight"
    
}

export const Modal = ({
    children,
    cancelLabel,
    confirmLabel,
    isOpen,
    title,
    onCancellation,
    onClose,
    onConfirmation,
    alignTitle = "left",
    variant = "default",

    // Base Props
    className,
    id,
    ...props

}: ModalProps) => {

    const classNames: string = [
        styles.modal,
        styles[alignTitle],
        styles[variant],
        
        className,
        id
    ].filter(Boolean).join(" ")

    if (!isOpen) return null

    const Actions = () => {

        if (confirmLabel != undefined && cancelLabel != undefined) {

            switch (variant) {

                default:
                    return (
                        <ButtonGroup bLFirst bRLast>
                            <ActionButton variant={"danger"} onClick={onCancellation}>{cancelLabel}</ActionButton>
                            <ActionButton variant={"success"} onClick={onConfirmation}>{confirmLabel}</ActionButton>
                        </ButtonGroup>
                    )
                
                case "gameInfo":
                    return null

                case "drawerLeft":
                    return (
                        <ButtonGroup bRLast bLFirstUnset>
                            <ActionButton variant={"danger"} onClick={onCancellation}>{cancelLabel}</ActionButton>
                            <ActionButton variant={"success"} onClick={onConfirmation}>{confirmLabel}</ActionButton>
                        </ButtonGroup>
                    )

                case "drawerRight":
                    return (
                        <ButtonGroup bLFirst bRLastUnset>
                            <ActionButton variant={"danger"} onClick={onCancellation}>{cancelLabel}</ActionButton>
                            <ActionButton variant={"success"} onClick={onConfirmation}>{confirmLabel}</ActionButton>
                        </ButtonGroup>
                    )

            }

        } else if (confirmLabel != undefined) {

            switch (variant) {
                default:
                    return (
                        <ButtonGroup bL bR>
                            <ActionButton variant={"success"} onClick={onConfirmation}>{confirmLabel}</ActionButton>
                        </ButtonGroup>
                    )

                case "gameInfo":
                    return (
                        <div className={styles.gameInfoAction}>
                            <ActionButton
                                width={"stretch"}
                                height={"medium"}
                                variant={"success"} 
                                onClick={onConfirmation}
                            >
                                {confirmLabel}
                            </ActionButton>
                        </div>
                    )

                case "drawerLeft":
                    return (
                        <ButtonGroup bR bLFirstUnset>
                            <ActionButton variant={"success"} onClick={onConfirmation}>{confirmLabel}</ActionButton>
                        </ButtonGroup>
                    )

                case "drawerRight":
                    return (
                        <ButtonGroup bL bRLastUnset>
                            <ActionButton variant={"success"} onClick={onConfirmation}>{confirmLabel}</ActionButton>
                        </ButtonGroup>
                    )
            }

        } else if (cancelLabel != undefined) {
            switch (variant) {
                default:
                    return (
                        <ButtonGroup bR bL>
                            <ActionButton variant={"danger"} onClick={onCancellation}>{cancelLabel}</ActionButton>
                        </ButtonGroup>
                    )

                case "gameInfo":
                    return null

                case "drawerLeft":
                    return (
                        <ButtonGroup bR bLFirstUnset>
                            <ActionButton variant={"danger"} onClick={onCancellation}>{cancelLabel}</ActionButton>
                        </ButtonGroup>
                    )

                case "drawerRight":
                    return (
                        <ButtonGroup bL bRLastUnset>
                            <ActionButton variant={"danger"} onClick={onCancellation}>{cancelLabel}</ActionButton>
                        </ButtonGroup>
                    )
            }
        }
    }
    

    return (
        <div className={styles.modalOverlay}>
            <dialog
                className={classNames}
                onClose={onClose && onClose}
                open={true}
                {...props}
            >
                {onClose && 
                    <CloseButton onClick={onClose}/>
                }
                
                <div className={styles.title}>
                    <Header
                        level={1}
                        fontSize={"xlarge"}
                    >
                        {title}
                    </Header>
                </div>
                
                <div className={styles.content}>
                    {children}
                </div>

                <Actions />
                
            </dialog>
        </div>
    )

}
