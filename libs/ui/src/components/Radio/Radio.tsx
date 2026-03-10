
import { BaseProps } from "../../types"
import styles from "./Radio.module.css"

interface RadioProps extends BaseProps {

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
    ...props 

}: RadioProps) => {

    const classNames: string = [
        styles.radioContainer,
        disabled && styles.disabled,

        className,
        id
    ].filter(Boolean).join(" ")

    return (
        <div 
            className={classNames}
            {...props}
        >
            <label className={styles.radioLabel}>

                <input
                    className={styles.radioInput}
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
