
import React from "react"
import { Meta, StoryObj } from "@storybook/react"
import { Table } from "../Table"
import { TableRow } from "../TableRow"

export default {
    title: "Components/Table",
    component: Table,
    parameters: {
        controls: {exclude: ["id", "className", "children", "dataId"]}
    }
} as Meta<typeof Table>

type Story = StoryObj<typeof Table>

export const Table_Default: Story = {
    name: "Default",
    args: {
        headers: ["Date", "Player", "Points"],
        children: 
        <>
            <TableRow>
                <td>January 1, 2025</td>
                <td>Player 1</td>
                <td>2500</td>
            </TableRow>
            <TableRow>
                <td>April 27, 2025</td>
                <td>Player 2</td>
                <td>1000</td>
            </TableRow>
            <TableRow>
                <td>February 19, 2025</td>
                <td>Player 3</td>
                <td>759</td>
            </TableRow>
            
        </>
    }
}
