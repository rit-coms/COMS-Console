
import { useState } from "react";
import { createContext } from "react";

export const SearchContext = createContext("")

export const SearchProvider = ({ children }) => {

    let [search, setSearch] = useState("")
    const [hasSearch, setHasSearch] = useState(false)

    const keyboardClick = (key) => {

        if (key == 'space' && search.length == 0)
            return

        if (key == 'del') {
            setSearch(search.slice(0, -1))

        } else if (key == 'space') {
            setSearch(search += " ")

        } else {
            setSearch(search += key)

        }
    }

    const submit = () => {
        if (search != "") {
            setSearch(search.trim())
            setHasSearch(true)
        }
    }

    const clear = () => {
        setSearch("")
        setHasSearch(false)
    }

    const values = {
        search, hasSearch, keyboardClick, submit, clear
    }

    return (
        <SearchContext.Provider value={values}>
            {children}
        </SearchContext.Provider>
    )

}
