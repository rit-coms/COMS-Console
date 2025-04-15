import { Children, isValidElement, ReactNode, useState } from "react"
import { BaseProps } from "../../types"
import { Container } from "../Container/Container"
import { Tab, TabProps } from "./Tab"
import styles from "./Tab.module.css"

export interface TabsProps extends BaseProps {

    // Content Props
    children: ReactNode

}

export const Tabs = ({ 
    children,
    
    // Base Props
    className,
    id,
    dataId,
    ...props

}: TabsProps): ReactNode => {

    const [activeIndex, setActiveIndex] = useState(0)

    const handleTabClick = (index: number) => {
        setActiveIndex(index)
    }

    const validChildren = Children.toArray(children).filter((child) =>
        isValidElement<TabProps>(child)
    )
 
    const classNames: string = [
        styles.tabs,

        className,
        id
    ].filter(Boolean).join(" ")

    return (
        <div 
            className={styles.tabsContainer}
            data-id={dataId && `${dataId}-container`}
            {...props}
        >
            
            <div className={classNames}>
                {validChildren.map((tab, index) => (
                    <Tab
                        key={index}
                        isActive={index == activeIndex}
                        label={tab.props.label}
                        onClick={() => handleTabClick(index)}
                        dataId={dataId && `tab-${tab.props.label.toLowerCase().replace(' ', '-')}`}
                        disabled={tab.props.disabled}
                    />
                ))}
            </div>

            <div className={styles.tabContent}>
                <Container>{validChildren[activeIndex].props.children}</Container>
            </div>

        </div>
    )

}
