
import { Meta, StoryObj } from "@storybook/react"
import { Search } from "../Search"

export default {
    title: "Components/Search",
    component: Search,
    parameters: {
        controls: {exclude: ["id", "className", "onChange", "onClick"]}
    }
} as Meta<typeof Search>

type Story = StoryObj<typeof Search>

export const Search_Default: Story = {
    name: "Default",
    args: {
        onChange: () => {},
        onClick: () => {},
        maxLength: 20,
        disabled: false,
        value: "",
        placeholder: "Search"
    }
}
