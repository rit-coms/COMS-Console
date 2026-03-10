
import { useState } from "react"
import { BaseProps } from "../../types"
import styles from "./CheckboxGroup.module.css"

interface CheckboxOption {

    // Content Props
    label: string

}

interface CheckboxGroupProps extends BaseProps {
    // Content Props
    options: CheckboxOption[]

    // Action Props
    onChange?: (values: string[]) => void

    // Styling Props
    disabled?: boolean
    selectedValues?: string[]
    
}

export const CheckboxGroup = ({ 
    options,
    onChange,
    disabled,
    selectedValues = [],
    
    // Base Props
    className,
    id,
    ...props

}: CheckboxGroupProps) => {

    const [internalValues, setInternalValues] = useState<string[]>(selectedValues)

    const handleChange = (newSelectedValue: string) => {
        let updatedValues
        if (internalValues?.includes(newSelectedValue)) 
            updatedValues = internalValues.filter(value => value != newSelectedValue)
        else
            updatedValues = [...internalValues, newSelectedValue]

        if (onChange)
            onChange(updatedValues)

        setInternalValues(updatedValues)
    }

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
            {options.map((option) => (
                <label 
                    className={styles.checkboxLabel}
                    key={option.label}
                >
                    <input
                        className={styles.checkbox}
                        checked={internalValues.includes(option.label)}
                        disabled={disabled}
                        onChange={() => handleChange(option.label)}
                        type={"checkbox"}
                        value={option.label}
                    />
                    {option.label}
                    
                </label>
            ))}
        </div>
    )

}
