
import * as LuIcons from "react-icons/lu"
import { BaseProps, ColorVariants } from "../../types"
import styles from "./Icon.module.css"

type IconName = keyof typeof LuIcons

interface IconProps extends BaseProps {

    // Content Props
    iconName: IconName

    // Styling Props
    variant?: ColorVariants

}

export const Icon = ({
    iconName,
    variant = "tertiary",
    
    // Base Props
    className,
    id,
    ...props

}: IconProps) => {

    const Icon = LuIcons[iconName]

    const classNames: string = [
        styles.icon,
        styles[variant],

        className,
        id
    ].filter(Boolean).join(" ")

    return (
        <div 
            className={classNames}
            {...props}
        >
            <Icon />
        </div>
    )
    
}
