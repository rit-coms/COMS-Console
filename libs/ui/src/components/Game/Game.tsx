
import { ReactNode } from "react"
import { BaseProps, FontSizes } from "../../types"
import { Header } from "../Typography/Header/Header"
import styles from "./Game.module.css"

export interface GameProps extends BaseProps {

    // Content Props
    gameId: string
    title: string
    filePath?: string
    author: string
    summary?: string
    releaseDate?: string
    multiplayer?: boolean
    genres?: string[]
    coverImage?: string
    timesPlayed?: number
    lastPlayed?: string
    exec?: string

    // Action Props
    onClick?: () => void
    
    // Styling Props
    fontSize?: FontSizes
    placeholder?: boolean
    
}

export const Game = ({
    gameId,
    title,
    filePath,
    author,
    summary,
    releaseDate,
    multiplayer,
    genres,
    coverImage,
    timesPlayed,
    lastPlayed,
    exec,
    onClick,
    fontSize = "xlarge",
    placeholder,
    
    // Base Props
    className,
    id,
    dataId,
    ...props

}: GameProps): ReactNode => {

    const classNames: string = [
        styles.game,
        placeholder && styles.placeholder,

        className,
        id
    ].filter(Boolean).join(" ")

    return (
        <div 
            className={styles.gameContainer} 
            tabIndex={0} 
            data-id={dataId && `${dataId}-container`}
            role={"button"}
        >
            <div
                className={classNames}
                style={{ backgroundImage: !coverImage?.includes("null") && `url(${coverImage})` || "" }}
                onClick={onClick}
                data-id={dataId && `${dataId}-${gameId}`}
                {...props}
            >
                {!coverImage &&
                    <div className={styles.name}>
                        <Header
                            dataId={dataId && `${dataId}-title`}
                            level={1}
                            fontSize={fontSize}
                        >
                            {title}
                        </Header>
                    </div>
                }
                
            </div>
        </div>
    )
    
}
