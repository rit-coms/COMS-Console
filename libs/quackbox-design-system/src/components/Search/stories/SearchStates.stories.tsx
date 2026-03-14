
import React from "react"
import { Meta, StoryObj } from "@storybook/react"
import { Search } from "../Search"

export default {
    title: "Components/Search/States",
    component: Search
} as Meta<typeof Search>

type Story = StoryObj<typeof Search>

export const SearchStates_Value: Story = {
    name: "Search w/ Value",
    render: () => (
        <Search
            onChange={() => {}}
            onClick={() => {}}
            placeholder={"Search"}
            value={"Horizon"}
        />
    )
}

export const SearchStates_NoPlaceholder: Story = {
    name: "Search w/o Placeholder",
    render: () => (
        <Search
            onChange={() => {}}
            onClick={() => {}}
            placeholder={""}
            value={""}
        />
    )
}

export const SearchStates_Disabled: Story = {
    name: "Disabled",
    render: () => (
        <Search
            disabled={true}
            onChange={() => {}}
            onClick={() => {}}
            placeholder={"Search"}
        />
    )
}
