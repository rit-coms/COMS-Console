
import React from "react"
import { Meta, StoryObj } from "@storybook/react"
import { Table } from "../Table"
import { TableData } from "../TableData"
import { TableRow } from "../TableRow"

export default {
    title: "Components/Table/Variants",
    component: Table
} as Meta<typeof Table>

type Story = StoryObj<typeof Table>

export const TableVariants_Default: Story = {
    name: "Table with No Header",
    render: () => (
        <Table>
            <TableRow>
                <TableData>one</TableData>
                <TableData>two</TableData>
                <TableData>three</TableData>
                <TableData>four</TableData>
            </TableRow>
            <TableRow>
                <TableData>uno</TableData>
                <TableData>dos</TableData>
                <TableData>tres</TableData>
                <TableData>quatro</TableData>
            </TableRow>
        </Table>
    )
}
