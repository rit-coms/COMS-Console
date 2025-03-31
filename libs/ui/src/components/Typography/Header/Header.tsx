
import { ElementType, ReactNode } from "react"
import { BaseProps, FontSizes, Weights } from "../../../types"
import styles from "../Typography.module.css"

export interface HeaderProps extends BaseProps {

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
    fontSize = "auto",
    weight = "normal",

    // Base Props
    className,
    id,
    dataId,
    ...props

}: HeaderProps): ReactNode => {

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
            data-id={dataId && dataId}
            {...props}
        >
            {children}
        </Tag>
    )

}
