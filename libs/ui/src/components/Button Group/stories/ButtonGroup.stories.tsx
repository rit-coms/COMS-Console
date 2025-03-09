
import React from "react"
import { Meta, StoryObj } from "@storybook/react"
import { Button } from "../../Button/Button"
import { ButtonGroup } from "../ButtonGroup"

export default {
    title: "Components/Button Group",
    component: ButtonGroup,
    parameters: {
        controls: {include: ["direction", "disabled", "gap"]}
    },
    argTypes: {
        direction: {control: {type: "inline-radio"}},
        gap: {control: {type: "text"}}
    }
} as Meta<typeof ButtonGroup>

type Story = StoryObj<typeof ButtonGroup>

export const ButtonGroup_Default: Story = {
    name: "Default",
    args: {
        children: 
            <>
                <Button>One</Button>
                <Button>Two</Button>
                <Button>Three</Button>
            </>
        ,
        direction: "row",
        disabled: false,
        gap: "4px"
    }
}
