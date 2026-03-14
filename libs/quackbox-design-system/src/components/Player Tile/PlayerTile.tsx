
import { ReactNode } from "react"
import { BaseProps } from "../../types"
import { Button } from "../Button/Button"
import { Text } from "../Typography/Text/Text"
import styles from "./PlayerTile.module.css"

export interface PlayerTileProps extends BaseProps {

    // Content Props
    playerNumber: number

    // Action Props
    onToggle?: () => void
    
    // Styling Props
    isConnected: boolean
    src: string
    
}

export const PlayerTile = ({
    playerNumber,
    onToggle,
    isConnected = false,
    src,
    
    // Base Props
    className,
    id,
    dataId,
    ...props

}: PlayerTileProps): ReactNode => {

    const classNames: string = [
        styles.playerTile,
        isConnected && styles.connected,

        className,
        id
    ].filter(Boolean).join(" ")

    return (
        <figure
            className={classNames}
            data-id={dataId && dataId}
            {...props}
        >
            <div 
                className={styles.playerIcon}
                data-id={dataId && `${dataId}-icon`}
            >
                {isConnected &&
                    <img
                        className={styles.playerImg}
                        src={src}
                    />
                }
            </div>
            
            <figcaption>
                <Button
                    dataId={dataId && `${dataId}-label`}
                    height={"medium"}
                    onClick={onToggle && onToggle}
                    variant={isConnected ? "primary" : "secondary"}
                    width={"stretch"}
                >
                    <Text dataId={dataId && `${dataId}-player-number`}>
                        Player {playerNumber}
                    </Text>
                </Button>
            </figcaption>

        </figure>
    )

}
