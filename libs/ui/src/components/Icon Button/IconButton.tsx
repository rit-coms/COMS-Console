
import * as LuIcons from "react-icons/lu"
import { ColorVariants } from "../../types"
import { ButtonProps } from "../Button/Button"
import styles from "./IconButton.module.css"

type IconName = keyof typeof LuIcons

export interface IconButtonProps extends Omit<ButtonProps, "children"> {

    // Content Props
    iconName: IconName

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
    ...props

}: IconButtonProps) => {

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
            disabled={disabled} 
            {...props}
        >
            <Icon />
        </button>
    )

}
