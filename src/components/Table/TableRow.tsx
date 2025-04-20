import { Children, isValidElement, ReactNode } from "react"
import { TableProps } from "./Table"
import { TableData, TableDataProps } from "./TableData"
import { Text } from "../Typography/Text/Text"
import styles from "./Table.module.css"

export interface TableRowProps extends Omit<TableProps, "headers"> {

    // Content Props
    children: ReactNode

}

export const TableRow = ({ 
    children,
    
    // Base Props
    className,
    id,
    dataId,
    ...props

}: TableRowProps): ReactNode => {

    const validChildren = Children.toArray(children).filter((child) =>
        isValidElement<TableDataProps>(child)
    )
 
    const classNames: string = [
        styles.tableRow,

        className,
        id
    ].filter(Boolean).join(" ")

    return (
        <tr
            className={classNames}
            data-id={dataId && dataId}
            {...props}
        >
            {validChildren.map((data, index) => {
                const rowDataId = typeof(data.props.children) === "string" && data.props.children.replace(" ", "-").toLowerCase()
                return (
                    <TableData 
                        key={index}
                        className={styles.tableData}
                        data-id={dataId && `${dataId}-data-${rowDataId && rowDataId}`}
                    >
                        <Text fontSize={"small"}>{data}</Text>
                    </TableData>
                )
            })}
        </tr>
    )

}
