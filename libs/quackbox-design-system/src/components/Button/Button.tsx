
import { ReactNode } from "react"
import { AlertVariants, BaseProps, ColorVariants, Sizes } from "../../types"
import styles from "./Button.module.css"

export interface ButtonProps extends BaseProps {
    
    // Content Props
    children: ReactNode

    // Action Props
    onClick?: () => void

    // Styling Props
    disabled?: boolean
    height?: Sizes
    variant?: ColorVariants | AlertVariants
    width?: "block" | "stretch"
    
}

export const Button = ({
    children,
    onClick,
    disabled,
    height = "medium",
    variant = "primary",
    width = "stretch",

    // Base Props
    className,
    id,
    dataId,
    ...props

}: ButtonProps): ReactNode => {

    const classNames: string = [
        styles.button,
        styles[height],
        styles[variant],
        styles[width],

        className,
        id
    ].filter(Boolean).join(" ")

    return (
        <button
            className={classNames}
            data-id={dataId && dataId}
            disabled={disabled}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    )
    
}
