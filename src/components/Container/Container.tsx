
import { ElementType, ReactNode } from "react"
import { BaseProps } from "../../types"
import styles from "./Container.module.css"

export interface ContainerProps extends BaseProps {

    // Content Props
    children: ReactNode
 
    // Styling Props
    as?: ElementType
    
}

export const Container = ({
    children,
    as: Tag = "div",
    
    // Base Props
    className,
    id,
    dataId,
    ...props

}: ContainerProps): ReactNode => {

    const classNames: string = [
        styles.container,

        className,
        id
    ].filter(Boolean).join(" ")

    return (
        <Tag
            className={classNames}
            data-id={dataId && dataId}
            {...props}
        >
            {children}
        </Tag>
    )
    
}
