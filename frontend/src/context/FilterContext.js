import { useState } from "react";
import { createContext } from "react";

export const FilterContext = createContext("")

export const FilterProvider = ({ children }) => {

    // const [filter, setFilter] = useState({
    //     players: "",
    //     genre: "",
    //     year: ""
    // })

    const [filter, setFilter] = useState({})

    const updateFilter = (accordion, option) => {
        switch (accordion) {
            case 'Players':
                // setFilter({ ...filter, players: option })
                setFilter({ players: option })
                break
            case 'Genre':
                // setFilter({ ...filter, genre: option })
                setFilter({ genre: option })
                break
            case 'Year of Development':
                // setFilter({ ...filter, year: option })
                setFilter({ year: option })
                break
        }
    }

    const clearFilter = () => {
        // setFilter({ players: "", genre: "", year: "" })
        setFilter({})
    }

    const values = {
        filter, updateFilter, clearFilter
    }

    return (
        <FilterContext.Provider value={values}>
            {children}
        </FilterContext.Provider>
    )

}
