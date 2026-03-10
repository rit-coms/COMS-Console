
import { ReactNode } from "react"
import { BaseProps } from "../../types"
import { Caret } from "../Caret/Caret"
import styles from "./Carousel.module.css"

interface CarouselProps extends BaseProps {
   
    // Content Props
    children: ReactNode

    // Action Props
    onPrev?: () => void
    onNext?: () => void

}

export const Carousel = ({
    children,
    onPrev,
    onNext,

    // Base Props
    className,
    id,
    ...props

}: CarouselProps) => {

    const classNames: string = [
        styles.carousel,

        className,
        id
    ].filter(Boolean).join(" ")

    return (
        <div
            className={classNames}
            {...props}
        >
            <Caret 
                direction={"left"} 
                onClick={onPrev} 
            />
            
            {children}

            <Caret 
                direction={"right"} 
                onClick={onNext} 
            />
        </div>
    )

}
