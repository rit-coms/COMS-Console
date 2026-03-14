import { ReactNode } from "react"
import { TableProps } from "./Table"

export interface TableDataProps extends Omit<TableProps, "headers"> {

    // Content Props
    children: ReactNode | string

}

export const TableData = ({ 
    children,
    
    // Base Props
    className,
    id,
    dataId,
    ...props

}: TableDataProps): ReactNode => {
 
    const classNames: string = [
        className,
        id

    ].filter(Boolean).join(" ")

    return (
        <td
            className={classNames}
            data-id={dataId && dataId}
            {...props}
        >
            {children}
        </td>
    )

}
