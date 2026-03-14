
import React from "react"
import { Meta, StoryObj } from "@storybook/react"
import { Icon } from "../Icon"

export default {
    title: "Components/Icon/Popular Icons",
    component: Icon
} as Meta<typeof Icon>

type Story = StoryObj<typeof Icon>

export const IconPopular_Text: Story = {
    name: "Text Icons",
    render: () => (
        <div>
            <span title={"LuALargeSmall"}><Icon iconName={"LuALargeSmall"} /></span>
            <span title={"LuAlignCenter"}><Icon iconName={"LuAlignCenter"} /></span>
            <span title={"LuAlignJustify"}><Icon iconName={"LuAlignJustify"} /></span>
            <span title={"LuAlignLeft"}><Icon iconName={"LuAlignLeft"} /></span>
            <span title={"LuAlignRight"}><Icon iconName={"LuAlignRight"} /></span>
        </div>
    )
}

export const IconPopular_Arrow: Story = {
    name: "Arrow Icons",
    render: () => (
        <div>
            <span title={"LuArrowDown"}><Icon iconName={"LuArrowDown"} /></span>
            <span title={"LuArrowDownAZ"}><Icon iconName={"LuArrowDownAZ"} /></span>
            <span title={"LuArrowDownUp"}><Icon iconName={"LuArrowDownUp"} /></span>
            <span title={"LuArrowDownZA"}><Icon iconName={"LuArrowDownZA"} /></span>
            <span title={"LuArrowLeft"}><Icon iconName={"LuArrowLeft"} /></span>
            <span title={"LuArrowRight"}><Icon iconName={"LuArrowRight"} /></span>
            <span title={"LuArrowUp"}><Icon iconName={"LuArrowUp"} /></span>
            <span title={"LuArrowUpAZ"}><Icon iconName={"LuArrowUpAZ"} /></span>
            <span title={"LuArrowUpDown"}><Icon iconName={"LuArrowUpDown"} /></span>
            <span title={"LuArrowUpZA"}><Icon iconName={"LuArrowUpZA"} /></span>
            <span title={"LuChevronDown"}><Icon iconName={"LuChevronDown"} /></span>
            <span title={"LuChevronLeft"}><Icon iconName={"LuChevronLeft"} /></span>
            <span title={"LuChevronRight"}><Icon iconName={"LuChevronRight"} /></span>
            <span title={"LuMoveDown"}><Icon iconName={"LuMoveDown"} /></span>
            <span title={"LuMoveLeft"}><Icon iconName={"LuMoveLeft"} /></span>
            <span title={"LuMoveRight"}><Icon iconName={"LuMoveRight"} /></span>
            <span title={"LuMoveUp"}><Icon iconName={"LuMoveUp"} /></span>
        </div>
    )
}

export const IconPopular_Symbol: Story = {
    name: "Symbol Icons",
    render: () => (
        <div>
            <span title={"LuAsterisk"}><Icon iconName={"LuAsterisk"} /></span>
            <span title={"LuAtSign"}><Icon iconName={"LuAtSign"} /></span>
            <span title={"LuCheck"}><Icon iconName={"LuCheck"} /></span>
            <span title={"LuCheckCheck"}><Icon iconName={"LuCheckCheck"} /></span>
            <span title={"LuCopyright"}><Icon iconName={"LuCopyright"} /></span>
            <span title={"LuDelete"}><Icon iconName={"LuDelete"} /></span>
            <span title={"LuListFilter"}><Icon iconName={"LuListFilter"} /></span>
            <span title={"LuMenu"}><Icon iconName={"LuMenu"} /></span>
        </div>
    )
}

export const IconPopular_Alert: Story = {
    name: "Alert Icons",
    render: () => (
        <div>
            <span title={"LuBadgeAlert"}><Icon iconName={"LuBadgeAlert"} /></span>
            <span title={"LuBadgeCheck"}><Icon iconName={"LuBadgeCheck"} /></span>
            <span title={"LuBadgeHelp"}><Icon iconName={"LuBadgeHelp"} /></span>
            <span title={"LuBadgeInfo"}><Icon iconName={"LuBadgeInfo"} /></span>
            <span title={"LuBadgeX"}><Icon iconName={"LuBadgeX"} /></span>
            <span title={"LuCircleAlert"}><Icon iconName={"LuCircleAlert"} /></span>
            <span title={"LuCircleCheck"}><Icon iconName={"LuCircleCheck"} /></span>
            <span title={"LuCircleCheckBig"}><Icon iconName={"LuCircleCheckBig"} /></span>
            <span title={"LuCircleHelp"}><Icon iconName={"LuCircleHelp"} /></span>
            <span title={"LuCircleX"}><Icon iconName={"LuCircleX"} /></span>
            <span title={"LuInfo"}><Icon iconName={"LuInfo"} /></span>
        </div>
    )
}
