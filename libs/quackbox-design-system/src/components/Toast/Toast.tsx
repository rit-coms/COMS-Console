
import { CSSProperties, ReactNode, useEffect, useState } from "react"
import { AlertVariants, BaseProps, Positions } from "../../types"
import { Logo } from "../Logo/Logo"
import styles from "./Toast.module.css"

export interface ToastProps extends BaseProps {

    // Content Props
    toastId?: string
    message: string

    // Action Props
    duration?: number

    // Styling Props
    iconSrc?: string
    position?: Positions
    variant: AlertVariants
    xOffset?: string
    yOffset?: string

}

export const Toast = ({
    toastId,
    message,
    duration = 3000,
    iconSrc,
    position = "bottom-right",
    variant,
    xOffset,
    yOffset,

    // Base Props
    className,
    id,
    dataId,
    ...props

}: ToastProps): ReactNode => {

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
                style={{ "--x-offset": xOffset, "--y-offset": yOffset} as CSSProperties}
                data-id={dataId && dataId}
                id={toastId && toastId}
                {...props}
            >
                <div className={styles.toastContent}>
                    { iconSrc && 
                        <Logo 
                            className={styles.toastIcon}
                            dataId={dataId && `${dataId}-logo`}
                            src={iconSrc}
                            variant={"logo"}
                        />
                    }

                    <span 
                        className={styles.toastMessage}
                        data-id={dataId && `${dataId}-message`}
                    >
                        {message}
                    </span> 
                </div>
                
            </div>
    )

}
