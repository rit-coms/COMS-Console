
import { ReactNode } from "react"
import { BaseProps, ColorVariants, Sizes } from "../../types"
import styles from "./Pill.module.css"

export interface PillProps extends BaseProps {

    // Content Props
    children: ReactNode

    // Styling Props
    size?: Sizes
    variant?: ColorVariants
   
}

export const Pill = ({
    children,
    size = "small",
    variant = "primary",
    
    // Base Props
    className,
    id,
    dataId,
    ...props

}: PillProps): ReactNode => {

    const classNames: string = [
        styles.pill, 
        styles[size],
        styles[variant],
        
        className,
        id
    ].filter(Boolean).join(" ")

    return (
        <span 
            className={classNames} 
            data-id={dataId && dataId}
            {...props}
        >
            {children}
        </span>
    )
    
}
