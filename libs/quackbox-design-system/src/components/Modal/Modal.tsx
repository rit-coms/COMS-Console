
import { ReactNode } from "react"
import { BaseProps } from "../../types"
import { ActionButton } from "../Action Button/ActionButton"
import { ButtonGroup } from "../Button Group/ButtonGroup"
import { CloseButton } from "../Close Button/CloseButton"
import { Header } from "../Typography/Header/Header"
import { Text } from "../Typography/Text/Text"
import styles from "./Modal.module.css"

export interface ModalProps extends BaseProps {
    
    // Content Props
    children: ReactNode
    cancelLabel?: string
    confirmLabel?: string
    isOpen: boolean
    title?: string | ReactNode
    subtitle?: string

    // Action Props
    onCancellation?: () => void
    onClose?: () => void 
    onConfirmation?: () => void
    
    // Styling Props
    alignContentCenter?: boolean
    alignTitle?: "left" | "center" | "right"
    confirmLabelColorPrimary?: boolean
    disableActionButtons?: boolean
    gameImageSrc?: string
    overlay?: boolean
    variant?: "default" | "gameInfo" | "dialog" | "drawerLeft" | "drawerRight"
    
}

export const Modal = ({
    children,
    cancelLabel,
    confirmLabel,
    isOpen,
    title,
    subtitle,
    onCancellation,
    onClose,
    onConfirmation,
    alignContentCenter,
    alignTitle = "left",
    confirmLabelColorPrimary = false,
    disableActionButtons,
    gameImageSrc,
    overlay,
    variant = "default",

    // Base Props
    className,
    id,
    dataId,
    ...props

}: ModalProps): ReactNode => {

    const classNames: string = [
        styles.modal,
        styles[alignTitle],
        styles[variant],
        
        className,
        id
    ].filter(Boolean).join(" ")

    if (!isOpen) return null

    return (
        <div 
            className={!overlay ? styles.modalContainer : `${styles.modalContainer} ${styles.modalOverlay}`}
            data-id={dataId && `${dataId}-container`}
        >
            <dialog
                className={classNames}
                data-id={dataId && `${dataId}`}
                onClose={onClose && onClose}
                open={true}
                {...props}
            >
                {onClose && 
                    <CloseButton 
                        dataId={dataId && `${dataId}-close-button`}
                        onClick={onClose}
                    />
                }
                
                {variant === "gameInfo" ?
                    <div className={styles.gameInfoContainer}>
                        <div className={styles.gameImageWrapper}>
                            <img 
                                className={styles.gameImage} 
                                src={gameImageSrc !== undefined ? gameImageSrc : undefined}
                                data-id={dataId && `${dataId}-image`}
                            />
                        </div>
                        <div className={styles.gameInfoContent}>
                            <div 
                                className={styles.gameInfoHeader} 
                                data-id={dataId && `${dataId}-header`}
                            >
                                {title && 
                                    <Header
                                        dataId={dataId && `${dataId}-title`}
                                        level={1}
                                        fontSize={"xlarge"}
                                    >
                                        {title}
                                    </Header>
                                }
                                {subtitle && 
                                    <Text dataId={dataId && `${dataId}-subtitle`}>
                                        {subtitle}
                                    </Text>
                                }
                            </div>
                            <div 
                                className={styles.gameDescription} 
                                data-id={dataId && `${dataId}-content`}
                            >
                                {children}
                            </div>
                        </div>
                    </div>
                    
                :
                    <>
                        <div 
                            className={styles.header} 
                            data-id={dataId && `${dataId}-header`}
                        >
                            {title && 
                                <Header
                                    dataId={dataId && `${dataId}-title`}
                                    level={1}
                                    fontSize={"xlarge"}
                                >
                                    {title}
                                </Header>
                            }
                            {subtitle && 
                                <Text dataId={dataId && `${dataId}-subtitle`}>
                                    {subtitle}
                                </Text>
                            }
                        </div>

                        <div 
                            className={!alignContentCenter ? styles.content : styles.alignContentCenter}
                            data-id={dataId && `${dataId}-content`}
                        >
                            {children}
                        </div>
                    </>
                }
                
                

                {(cancelLabel || confirmLabel) && (
                    <ButtonGroup className={styles.footer} bL bR dataId={dataId && `${dataId}-action-button-group`}>
                        {cancelLabel &&
                            <ActionButton disabled={disableActionButtons} variant={"danger"} onClick={onCancellation} dataId={dataId && `${dataId}-cancel-button`}>
                                <Text dataId={dataId && `${dataId}-cancel-button-label`}>{cancelLabel}</Text>
                            </ActionButton>
                        }
                        {confirmLabel &&
                            <ActionButton disabled={disableActionButtons} variant={!confirmLabelColorPrimary ? "success" : undefined} onClick={onConfirmation} dataId={dataId && `${dataId}-confirm-button`}>
                                <Text dataId={dataId && `${dataId}-confirm-button-label`}>{confirmLabel}</Text>
                            </ActionButton>
                        }
                    </ButtonGroup>
                )}
                
            </dialog>
        </div>
    )

}
