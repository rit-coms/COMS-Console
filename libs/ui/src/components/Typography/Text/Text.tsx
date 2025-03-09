
import { ElementType, ReactNode } from "react"
import { BaseProps, FontSizes, Weights } from "../../../types"
import styles from "../Typography.module.css"

export interface TextProps extends BaseProps {

    // Content Props
    children: ReactNode

    // Styling Props
    as?: ElementType
    fontSize?: FontSizes
    weight?: Weights
    
}

export const Text = ({
    children,
    as: Tag = "p",
    fontSize = "auto",
    weight = "normal",
    
    // Base Props
    className,
    id,
    ...props

}: TextProps): ReactNode => {

    const classNames = [
        styles.text,
        styles[fontSize],
        styles[weight],
        
        className,
        id
    ].filter(Boolean).join(" ")

    return (
        <Tag 
            className={classNames}
            {...props}
        >
            {children}
        </Tag>
    )

}
