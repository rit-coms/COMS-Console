
import { ReactNode } from "react"
import { BaseProps } from "../../types"
import styles from "./Caret.module.css"

export interface CaretProps extends BaseProps {

    // Action Props
    onClick?: () => void
    
    // Styling Props
    color?: string
    direction: "right" | "left"
    disabled?: boolean
    size?: number | string
    strokeWidth?: number
    
}

export const Caret = ({
    onClick,
    color = "#99D6DE",
    direction = "left",
    disabled = false,
    size = "5em",
    strokeWidth = 4,
    
    // Base Props
    className,
    id,
    dataId,
    ...props

}: CaretProps): ReactNode => {

    const classNames: string = [
        styles.caret,
        disabled && styles.disabled,

        className,
        id
    ].filter(Boolean).join(" ")

    const x1: number = direction === "left" ? 35 : 65
    const x2: number = direction === "left" ? 65 : 35
    const y1Top: number = 50, y2Bottom: number = 50
    const y2Top: number = 10
    const y1Bottom: number = 90

    return (
        <div
            className={classNames}
            data-id={dataId && dataId}
            onClick={onClick}
            {...props}
        >
            <svg 
                className={`${styles.icon} ${styles[direction]}`}
                fill={"none"}
                height={size}
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap={"round"}
                viewBox={"0 0 100 100"}
                width={size}
            >
                <line
                    x1={x1} y1={y1Top} 
                    x2={x2} y2={y2Top}
                />
                <line 
                    x1={x2} y1={y1Bottom} 
                    x2={x1} y2={y2Bottom}
                />
            </svg>
        </div>
    )

}
