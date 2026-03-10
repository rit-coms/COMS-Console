
import { ElementType, ReactNode } from "react"
import { BaseProps, FontSizes, Weights } from "../../../types"
import styles from "../Typography.module.css"

interface HeaderProps extends BaseProps {

    // Content Props
    children: ReactNode

    // Styling Props
    level?: 1 | 2 | 3 | 4 | 5 | 6
    fontSize?: FontSizes
    weight?: Weights

}

export const Header = ({
    children,
    level = 2,
    fontSize = "default",
    weight = "normal",

    // Base Props
    className,
    id,
    ...props

}: HeaderProps) => {

    const classNames = [
        styles.header,
        styles[fontSize],
        styles[weight],

        className,
        id
    ].filter(Boolean).join(" ")

    const Tag: ElementType = `h${level}`

    return (
        <Tag 
            className={classNames}
            {...props}
        >
            {children}
        </Tag>
    )

}
