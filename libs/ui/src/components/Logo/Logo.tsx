
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
            {...props}
        >
            {variant !== "text" &&
                <img src={src} className={styles.logoImage}/>
            }
            {variant !== "logo" &&
                <span className={styles.logoText}>QuackBox</span>
            }
        </div>
    )
    
}
