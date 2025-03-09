
import { ReactNode } from "react"
import { Positions } from "../../types"
import { IconButton, IconButtonProps } from "../Icon Button/IconButton"
import styles from "./CloseButton.module.css"

export interface CloseButtonProps extends Omit<IconButtonProps, "iconName"> {

    // Styling Props
    position?: Positions

}

export const CloseButton = ({
    disabled,
    height = "medium",
    onClick,
    position = "top-right",
    variant = "text",
    width = "block",
    
    // Base Props
    className,
    id,
    ...props

}: CloseButtonProps): ReactNode => {

    const classNames: string = [
        styles.button,
        styles.closeButton,
        styles[height],
        styles[position],
        styles[variant],
        styles[width],
        disabled && styles.disabled,

        className,
        id
    ].filter(Boolean).join(" ")

    return (
        <IconButton
            className={classNames}
            iconName={"LuX"}
            onClick={onClick}
            variant={variant}
            {...props}
        />
    )

}
