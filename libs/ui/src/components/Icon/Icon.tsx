
import * as LuIcons from "react-icons/lu"
import { BaseProps, ColorVariants } from "../../types"
import styles from "./Icon.module.css"
import { ReactNode } from "react"

export type IconName = keyof typeof LuIcons

export interface IconProps extends BaseProps {

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
    dataId,
    ...props

}: IconProps): ReactNode => {

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
            data-id={dataId && dataId}
            {...props}
        >
            <Icon />
        </div>
    )
    
}
