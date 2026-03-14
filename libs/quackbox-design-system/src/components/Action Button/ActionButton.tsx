
import { ReactNode } from "react"
import { AlertVariants } from "../../types"
import { Button, ButtonProps } from "../Button/Button"
import styles from "./ActionButton.module.css"

export interface ActionButtonProps extends Omit<ButtonProps, "variant"> {

    // Styling Props
    variant?: AlertVariants

}

export const ActionButton = ({
    children,
    onClick,
    disabled,
    height = "medium",
    variant,
    width = "stretch",

    // Base Props
    className,
    id,
    dataId,
    ...props

}: ActionButtonProps): ReactNode => {

    const classNames: string = [
        styles.button,
        styles.actionButton,
        styles[height],
        variant && styles[variant],
        styles[width],

        className,
        id
    ].filter(Boolean).join(" ")

    return (
        <Button
            className={classNames}
            dataId={dataId && dataId}
            disabled={disabled}
            onClick={onClick}
            variant={variant}
            {...props}
        >
            {children}
        </Button>
    )
    
}
