
import { ReactNode } from "react"
import { BaseProps } from "../../types"
import styles from "./Checkbox.module.css"

export interface CheckboxProps extends BaseProps {

    // Content Props
    children: string

    // Action Props
    onChange: (checked: boolean) => void

    // Styling Props
    checked?: boolean
    disabled?: boolean

}

export const Checkbox = ({ 
    children,
    onChange,
    checked, 
    disabled,

    // Base Props
    className,
    id,
    ...props

}: CheckboxProps): ReactNode => {

    const classNames: string = [
        styles.checkboxContainer,
        disabled && styles.disabled,
        
        className,
        id
    ].filter(Boolean).join(" ")

    return (
        <div 
            className={classNames} 
            {...props}
        >
             <label className={styles.checkboxLabel}>
                
                <input
                    className={styles.checkbox}
                    checked={checked}
                    disabled={disabled}
                    onChange={(e) => onChange(e.target.checked)}
                    type={"checkbox"} 
                />
                {children}

            </label>
        </div>
    )

}
