
import { BaseProps, FontSizes } from "../../types"
import { Header } from "../Typography/Header/Header"
import styles from "./Game.module.css"

interface GameProps extends BaseProps {

    // Content Props
    title: string
    imageUrl?: string

    // Action Props
    onClick?: () => void
    
    // Styling Props
    fontSize?: FontSizes
    placeholder?: boolean
    
}

export const Game = ({
    title,
    imageUrl,
    onClick,
    fontSize = "xlarge",
    placeholder,
    
    // Base Props
    className,
    id,
    ...props

}: GameProps) => {

    const classNames: string = [
        styles.game,
        placeholder && styles.placeholder,

        className,
        id
    ].filter(Boolean).join(" ")

    return (
        <div
            className={classNames}
            style={{backgroundImage: `url(${imageUrl})`}}
            onClick={onClick}
            tabIndex={0}
            {...props}
        >
            {!imageUrl &&
                <div className={styles.name}>
                    <Header
                        level={1}
                        fontSize={fontSize}
                    >
                        {title}
                    </Header>
                </div>
            }
            
        </div>
    )
    
}
