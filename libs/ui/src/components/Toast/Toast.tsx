
import { useEffect, useState } from "react"
import { AlertVariants, BaseProps, Positions } from "../../types"
import { Logo } from "../Logo/Logo"
import styles from "./Toast.module.css"

interface ToastProps extends BaseProps {

    // Content Props
    message: string

    // Action Props
    duration?: number

    // Styling Props
    iconSrc?: string
    position?: Positions
    variant: AlertVariants

}

export const Toast = ({
    message,
    duration = 3000,
    iconSrc,
    position = "bottom-right",
    variant,

    // Base Props
    className,
    id,
    ...props

}: ToastProps) => {

    const [isVisible, setIsVisible] = useState<boolean>(true)

    useEffect(() => {
        const timer: number = setTimeout(() => {
            setIsVisible(false)
        }, duration)
        return () => clearTimeout(timer)
    }, [duration])

    const classNames: string = [
        styles.toast, 
        styles[position],
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
                <div className={styles.toastContent}>
                    { iconSrc && 
                        <Logo 
                            className={styles.toastIcon}
                            src={iconSrc}
                            variant={"logo"}
                        />
                    }

                    <span className={styles.toastMessage}>
                        {message}
                    </span> 
                </div>
                
            </div>
    )

}
