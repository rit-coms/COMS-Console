
import { ReactNode, useState } from "react"
import { BaseProps } from "../../types"
import styles from "./CheckboxGroup.module.css"

export interface CheckboxOption {

    // Content Props
    label: string

}

export interface CheckboxGroupProps extends BaseProps {
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
    dataId,
    ...props

}: CheckboxGroupProps): ReactNode => {

    const [internalValues, setInternalValues] = useState<string[]>(selectedValues)

    const handleChange = (newSelectedValue: string) => {
        let updatedValues
        if (internalValues?.includes(newSelectedValue)) 
            updatedValues = internalValues.filter(value => value !== newSelectedValue)
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
            data-id={dataId && dataId}
            {...props}
        >
            {options.map((option) => (
                <label 
                    className={styles.checkboxLabel}
                    data-id={dataId && `${dataId}-label`}
                    key={option.label}
                >
                    <input
                        className={styles.checkbox}
                        data-id={dataId && `${dataId}-checkbox`}
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
