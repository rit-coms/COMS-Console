
import React from "react"
import { Meta, StoryObj } from "@storybook/react"
import { Carousel } from "../Carousel"
import { Game } from "../../Game/Game"

export default {
    title: "Components/Carousel",
    component: Carousel,
    parameters: {
        controls: {exclude: ["id", "className", "children", "onNext", "onPrev"]}
    }
} as Meta<typeof Carousel>

type Story = StoryObj<typeof Carousel>

export const Carousel_Default: Story = {
    name: "Default",
    args: {
        children:
        <>
            {["Horizon", "Imprint", "Pond Invaders"].map((name, index) => (
                <Game
                    key={index}
                    title={name}
                    onClick={() => {}}
                />
            ))}
        </>
    }
}
