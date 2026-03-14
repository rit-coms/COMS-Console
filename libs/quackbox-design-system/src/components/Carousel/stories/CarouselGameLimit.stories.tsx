
import React from "react"
import { Meta, StoryObj } from "@storybook/react"
import { Carousel } from "../Carousel"

export default {
    title: "Components/Carousel/Featured Limits",
    component: Carousel
} as Meta<typeof Carousel>

type Story = StoryObj<typeof Carousel>

export const CarouselFeaturedLimit_Three: Story = {
    name: "3 Game Limit",
    render: () => {
        return (
            <Carousel 
                games={
                    [
                        {id: "123", title: "Horizon", author: "John Doe", coverImage: "/assets/horizon.png" },
                        {id: "234", title: "Attack", author: "John Doe", coverImage: "" },
                        {id: "345", title: "Waddle", author: "John Doe", coverImage: "" }
                    ]
                }
                onGameClick={() => {}}
                featuredGameLimit={3}
            />
        )
    }
}

export const CarouselFeaturedLimit_Four: Story = {
    name: "4 Game Limit",
    render: () => {
        return (
            <Carousel 
                games={
                    [
                        {id: "123", title: "Horizon", author: "John Doe", coverImage: "/assets/horizon.png" },
                        {id: "234", title: "Attack", author: "John Doe", coverImage: "" },
                        {id: "345", title: "Waddle", author: "John Doe", coverImage: "" },
                        {id: "456", title: "Happy Feet", author: "John Doe", coverImage: "" }
                    ]
                }
                onGameClick={() => {}}
                featuredGameLimit={4}
            />
        )
    }
}