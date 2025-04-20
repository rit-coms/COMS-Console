import { ReactNode } from "react"
import { BaseProps } from "../../types"
import { Header } from "../Typography/Header/Header"
import styles from "./Table.module.css"

export interface TableProps extends BaseProps {

    // Content Props
    children: ReactNode
    headers?: string[]

}

export const Table = ({ 
    children,
    headers,
    
    // Base Props
    className,
    id,
    dataId,
    ...props

}: TableProps): ReactNode => {
 
    const classNames: string = [
        styles.table,

        className,
        id
    ].filter(Boolean).join(" ")

    return (
        <div 
            className={styles.tableContainer}
            data-id={dataId && `${dataId}-container`}
            {...props}
        >
            <table 
                className={classNames}
                data-id={dataId && dataId}
            >
                <thead data-id={dataId && `${dataId}-head`}>
                    {headers && 
                        <tr>
                            {headers.map((header, index) => (
                                <th
                                    key={index}
                                    className={styles.tableHeader}
                                    data-id={dataId && `${dataId}-header-column-${index+1}`}
                                >
                                    <Header weight={"bold"}>{header}</Header>
                                </th>
                            ))}
                        </tr>
                    }
                </thead>

                <tbody>{children}</tbody>
                
            </table>
        </div>
    )

}
