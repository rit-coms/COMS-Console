import { useState } from "react";
import { createContext } from "react";

export const SortContext = createContext("")

export const SortProvider = ({children}) => {

    const sortValues = [
        "None",
        "Name - Alphabetical",
        "Name - Reverse Alphabetical",
        "Year - Newest to Oldest",
        "Year - Oldest to Newest",
        "Most Played",
        "Least Played",
    ]

    const [sort, setSort] = useState(sortValues[0])

    const updateSort = () => {
        if (sortValues.indexOf(sort) +1 >= sortValues.length) {
            setSort(sortValues[0])
            return
        }
        setSort(sortValues[sortValues.indexOf(sort)+1])
    }

    const values = {
        sort, updateSort
    }

    return (
        <SortContext.Provider value={values}>
            {children}
        </SortContext.Provider>
    )

}
