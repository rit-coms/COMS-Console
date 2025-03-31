
import { Meta, StoryObj } from "@storybook/react"
import { Carousel } from "../Carousel"

export default {
    title: "Components/Carousel",
    component: Carousel,
    parameters: {
        controls: {include: ["games", "featuredGameLimit"]}
    },
    argTypes: {
        featuredGameLimit: {control: {type: "inline-radio"}}
    }
} as Meta<typeof Carousel>

type Story = StoryObj<typeof Carousel>

export const Carousel_Default: Story = {
    name: "Default",
    args: {
        games: [
            {id: "123", title: "Horizon", author: "John Doe", coverImage: "/assets/horizon.png" },
            {id: "234", title: "DuckStep", author: "John Doe", coverImage: "/assets/Duckstep.png" },
            {id: "345", title: "Waddle", author: "John Doe", coverImage: "" }
        ],
        featuredGameLimit: 3
    }
}
