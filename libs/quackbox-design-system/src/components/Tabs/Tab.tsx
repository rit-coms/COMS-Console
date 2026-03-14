import { ReactNode } from "react"
import { BaseProps } from "../../types"
import { Header } from "../Typography/Header/Header"
import styles from "./Tab.module.css"

export interface TabProps extends BaseProps {

    // Content Props
    children?: ReactNode
    label: string

    // Action Props
    onClick?: () => void

    // Styling Props
    disabled?: boolean
    isActive?: boolean

}

export const Tab = ({ 
    label,
    onClick,
    disabled = false,
    isActive,
    
    // Base Props
    className,
    id,
    dataId,
    ...props

}: TabProps): ReactNode => {
 
    const classNames: string = [
        styles.tab,
        isActive && styles.active,

        className,
        id
    ].filter(Boolean).join(" ")

    return (
        <button
            className={classNames}
            onClick={onClick}
            disabled={disabled}
            data-id={dataId && dataId}
            {...props}
        >
            <Header>{label}</Header>
        </button>
    )

}
