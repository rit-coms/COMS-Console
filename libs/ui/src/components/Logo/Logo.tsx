
import { ReactNode } from "react"
import { BaseProps } from "../../types"
import styles from "./Logo.module.css"

export interface LogoProps extends BaseProps {

    // Styling Props
    src: string
    variant?: "logo" | "text" | "default"

}

export const Logo = ({
    src,
    variant = "default",

    // Base Props
    className,
    id,
    dataId,
    ...props

}: LogoProps): ReactNode => {

    const classNames: string = [
        styles.logo,

        className,
        id
    ].filter(Boolean).join(" ")

    return (
        <div 
            className={classNames}
            data-id={dataId && dataId}
            {...props}
        >
            {variant !== "text" &&
                <img 
                    src={src} 
                    className={styles.logoImage} 
                    data-id={dataId && `${dataId}-logo`}
                />
            }
            {variant !== "logo" &&
                <span 
                    className={styles.logoText}
                    data-id={dataId && `${dataId}-name`}
                >
                    QuackBox
                </span>
            }
        </div>
    )
    
}
