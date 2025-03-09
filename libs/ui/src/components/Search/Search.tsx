
import { ReactNode } from "react"
import { BaseProps } from "../../types"
import styles from "./Search.module.css"

export interface SearchProps extends BaseProps {

    // Action Props
    onChange: () => void
    onClick: () => void

    // Styling Props
    disabled?: boolean
    maxLength?: number
    placeholder?: string
    value?: string
    
}

export const Search = ({
    onChange,
    onClick,
    disabled,
    maxLength = 20,
    placeholder,
    value,
    
    // Base Props
    className,
    id,
    ...props

}: SearchProps): ReactNode => {

    const classNames: string = [
        styles.search,

        className,
        id
    ].filter(Boolean).join(" ")

    return (
        <input
            className={classNames}
            autoComplete={"off"}
            disabled={disabled}
            maxLength={maxLength}
            onChange={onChange}
            onClick={onClick}
            placeholder={placeholder}
            readOnly
            type={"search"}
            value={value}
            {...props}
        />
    )

}
