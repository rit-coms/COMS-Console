
import { ReactNode } from "react"
import { BaseProps, FontSizes, Weights } from "../../types"
import { Text } from "../Typography/Text/Text"
import styles from "./Link.module.css"

export interface LinkProps extends BaseProps {

    // Content Props
    children: ReactNode
    href?: string
    target?: "_blank" | "_self" | "_parent" | "_top"

    // Action Props
    onClick?: () => void

    // Styling Props
    fontSize?: FontSizes
    weight?: Weights

}

export const Link = ({
    children,
    href,
    target,
    onClick,
    fontSize = "auto",
    weight = "normal",

    // Base Props
    className,
    id,
    dataId,
    ...props

}: LinkProps): ReactNode => {

    const classNames: string = [
        styles.link,

        className,
        id
    ].filter(Boolean).join(" ")

    return (
        <a
            className={classNames}
            href={href}
            target={target}
            onClick={onClick}
            data-id={dataId && dataId}
            {...props}
        >
            <Text 
                as={"span"} 
                fontSize={fontSize} 
                weight={weight}
            >
                {children}
            </Text>
        </a>
    )
    
}
