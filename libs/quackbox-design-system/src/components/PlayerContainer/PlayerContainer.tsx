
import { CSSProperties, ReactNode } from "react"
import { BaseProps } from "../../types"
import styles from "./PlayerContainer.module.css"

export interface PlayerContainerProps extends BaseProps {

    // Content Props
    children: ReactNode
    numPlayers: number
    
}

export const PlayerContainer = ({
    children,
    numPlayers,
    
    // Base Props
    className,
    id,
    dataId,
    ...props

}: PlayerContainerProps): ReactNode => {

    const gridMode: boolean = numPlayers > 4

    const classNames: string = [
        styles.playerContainer,
        gridMode && styles.grid,

        className,
        id
    ].filter(Boolean).join(" ")

    return (
        <div
            className={classNames}
            data-id={dataId && dataId}
            style={{ "--num-players": Math.min(numPlayers, 4)} as CSSProperties}
            {...props}
        >
            {children}
        </div>
    )
    
}
