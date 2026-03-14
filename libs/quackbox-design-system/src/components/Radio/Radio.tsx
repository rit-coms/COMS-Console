
import { ReactNode } from "react"
import { BaseProps } from "../../types"
import styles from "./Radio.module.css"

export interface RadioProps extends BaseProps {

    // Content Props
    children: string

    // Action Props
    onChange: (value: string) => void

    // Styling Props
    disabled?: boolean
    selected?: boolean

}

export const Radio = ({ 

    children,
    onChange,
    disabled,
    selected, 
    
    // Base Props
    className,
    id,
    dataId,
    ...props 

}: RadioProps): ReactNode => {

    const classNames: string = [
        styles.radioContainer,
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
            <label 
                className={styles.radioLabel}
                data-id={dataId && `${dataId}-label`}
            >

                <input
                    className={styles.radioInput}
                    data-id={dataId && `${dataId}-radio`}
                    checked={selected}
                    disabled={disabled}
                    onChange={(e) => onChange(e.target.value)}
                    type={"radio"}
                    value={children}
                />
                {children}

            </label>
        </div>
    )
    
}
