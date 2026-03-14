
import * as LuIcons from "react-icons/lu"
import { ColorVariants } from "../../types"
import { ButtonProps } from "../Button/Button"
import styles from "./IconButton.module.css"
import { ReactNode } from "react"

export type LuIconName = keyof typeof LuIcons

export interface IconButtonProps extends Omit<ButtonProps, "children"> {

    // Content Props
    iconName: LuIconName

    // Styling Props
    variant?: ColorVariants

}

export const IconButton = ({
    iconName,
    disabled,
    variant = "secondary",
    width = "block",

    // Base Props
    className,
    id,
    dataId,
    ...props

}: IconButtonProps): ReactNode => {

    const Icon = LuIcons[iconName]

    const classNames: string = [
        styles.button,
        styles.iconButton,
        styles[variant],
        styles[width],
        disabled && styles.disabled,

        className,
        id
    ].filter(Boolean).join(" ")

    return (
        <button 
            className={classNames}
            data-id={dataId && dataId}
            disabled={disabled} 
            {...props}
        >
            <Icon />
        </button>
    )

}
