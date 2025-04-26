
import { ReactNode, useState } from "react"
import { BaseProps } from "../../types"
import { Caret } from "../Caret/Caret"
import { Game } from "../Game/Game"
import styles from "./Carousel.module.css"

export interface GameOption {

    // Content Props
    id: string
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

}

export interface CarouselProps extends BaseProps {
   
    // Content Props
    games: GameOption[]

    // Action Props
    onGameClick: (game: GameOption) => void
    onPrev?: () => void
    onNext?: () => void

    // Styling Props
    featuredGameLimit ?: 3 | 4

}

export const Carousel = ({
    games,
    onGameClick,
    onPrev,
    onNext,
    featuredGameLimit = 3,

    // Base Props
    className,
    id,
    dataId,
    ...props

}: CarouselProps): ReactNode => {

    const [currentIndex, setCurrentIndex] = useState(0)
    const totalGames = games.length

    const handleNext = () => {
        if (totalGames <= featuredGameLimit)
            return
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalGames)
    }

    const handlePrev = () => {
        if (totalGames <= featuredGameLimit)
            return
        setCurrentIndex((prevIndex) => (prevIndex - 1 + totalGames) % totalGames)
    }
    
    const numPlaceholders = Math.max(0, featuredGameLimit - totalGames)
    const placeholders: GameOption[] = 
        Array.from({length: numPlaceholders}).map((_, index) => (
            {
                id: `carousel-placeholder-${index}`,
                title: "Coming Soon...",
                author: "[Your Name Here]",
                summary: "Got a game idea? Reach out to the COMS Tech Projects Chair to get started and they'll guide you through everything you need to bring your game to life. Just ask how!",
                coverImage: "src/assets/coming_soon.png"
            }
        ))

    let displayedGames: GameOption[] = []
    if (totalGames < featuredGameLimit) {
        for (let i = 0; i < totalGames; i++) {
            const index = (currentIndex + i) % totalGames
            displayedGames.push(games[index])
        }
        displayedGames = [...displayedGames, ...placeholders]

    } else {
        for (let i = 0; i < featuredGameLimit; i++) {
            const index = (currentIndex + i) % totalGames
            displayedGames.push(games[index])
        }

    }
        
    const classNames: string = [
        styles.carousel,

        className,
        id
    ].filter(Boolean).join(" ")

    return (
        <div
            className={classNames}
            data-id={dataId && dataId}
            {...props}
        >
            <Caret 
                dataId={dataId && `${dataId}-left-caret`}
                direction={"left"} 
                onClick={onPrev && onPrev || handlePrev} 
                disabled={totalGames <= featuredGameLimit}
            />

            {displayedGames.map((game) => {
                return (
                    <Game
                        key={game.id}
                        dataId={"game"}
                        gameId={game.id}
                        title={game.title}
                        author={game.author}
                        coverImage={!game.coverImage?.includes("null") && game.coverImage || undefined}
                        onClick={onGameClick && (() => onGameClick(game))}
                        placeholder={game.id.includes("placeholder")}
                    />
                )
            })}

            <Caret 
                dataId={dataId && `${dataId}-right-caret`}
                direction={"right"} 
                onClick={onNext && onNext || handleNext} 
                disabled={totalGames <= featuredGameLimit}
            />
        </div>
    )

}
