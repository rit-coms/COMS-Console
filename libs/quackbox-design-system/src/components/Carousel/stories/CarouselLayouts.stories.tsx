
import React from "react"
import { Meta, StoryObj } from "@storybook/react"
import { Carousel } from "../Carousel"
import { Game } from "../../Game/Game"

export default {
    title: "Components/Carousel/Layouts",
    component: Carousel
} as Meta<typeof Carousel>

type Story = StoryObj<typeof Carousel>

export const CarouselLayouts_3: Story = {
    name: "3 Games Featured",
    render: () => {
        const titles = ["Horizon", "Imprint", "Pond Invaders"]

        return (
            <Carousel
                onPrev={() => {}}
                onNext={() => {}}
            >
                {Array.from({length: 3}).map((_, index) => (
                    <Game
                        key={index}
                        title={titles[index]}
                        onClick={() => {}}
                    />
                ))}

            </Carousel>
        )
    }
}

export const CarouselLayouts_4: Story = {
    name: "4 Games Featured",
    render: () => {
        const titles = ["Horizon", "Imprint", "Pond Invaders", "Quack Attack"]
        
        return (
            <Carousel
                onPrev={() => {}}
                onNext={() => {}}
            >
                {Array.from({length: 4}).map((_, index) => (
                    <Game
                        key={index}
                        title={titles[index]}
                        onClick={() => {}}
                    />
                ))}

            </Carousel>
        )
    }
}
