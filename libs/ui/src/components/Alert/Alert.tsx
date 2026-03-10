
import { useEffect, useState } from "react"
import { AlertVariants, BaseProps } from "../../types"
import { CloseButton } from "../Close Button/CloseButton"
import styles from "./Alert.module.css"

interface AlertProps extends BaseProps {

    // Content Props
    message: string

    // Action Props
    duration?: number
    onClose?: () => void

    // Styling Props
    variant: AlertVariants

}

export const Alert = ({
    message,
    duration = 6000,
    onClose,
    variant,

    // Base Props
    className,
    id,
    ...props

}: AlertProps) => {

    const [isVisible, setIsVisible] = useState<boolean>(true)

    const handleOnClose = () => {
        setIsVisible(false)
    }

    useEffect(() => {
        const timer: number = setTimeout(() => {
            setIsVisible(false)
            if (onClose) onClose() 
            else handleOnClose()
        }, duration)
        return () => clearTimeout(timer)
    }, [duration, onClose])

    

    const classNames: string = [
        styles.alert, 
        styles[variant],

        className,
        id
    ].filter(Boolean).join(" ")

    return (
        isVisible && 
            <div 
                className={classNames} 
                {...props}
            >
                <div className={styles.alertContent}>
                    
                    <span className={styles.alertMessage}>
                        {message}
                    </span> 
                   
                    <CloseButton 
                        className={styles.alertClose}
                        onClick={onClose || handleOnClose}
                        height={"small"} 
                    />
         
                </div>
                
            </div>
    )
    
}
