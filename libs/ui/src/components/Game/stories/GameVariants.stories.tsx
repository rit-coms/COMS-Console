
import React from "react"
import { Meta, StoryObj } from "@storybook/react"
import { Game } from "../Game"

export default {
    title: "Components/Game/Variants",
    component: Game
} as Meta<typeof Game>

type Story = StoryObj<typeof Game>

export const GameVariants_PlaceholderImage: Story = {
    name: "Placeholder w/ Cover Image",
    render: () => (
        <Game
            title={"Horizon"}
            imageUrl={"/assets/coming_soon.png"}
            placeholder={true}
            onClick={()=>{}}
        />
    )
}

export const GameVariants_PlaceholderNoImage: Story = {
    name: "Placeholder w/o Cover Image",
    render: () => (
        <Game
            title={"Coming Soon"}
            placeholder={true}
            onClick={()=>{}}
        />
    )
}

export const GameVariants_NoCoverImage: Story = {
    name: "Game w/o Cover Image",
    render: () => (
        <Game
            title={"Horizon"}
            fontSize={"xlarge"}
            onClick={()=>{}}
        />
    )
}
