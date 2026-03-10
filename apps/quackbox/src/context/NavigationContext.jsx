import React, { createContext, useState } from "react";

export const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {

    const [searchValue, setSearchValue] = useState("");
    const [savedSearchValue, setSavedSearchValue] = useState("");

    const [sortOption, setSortOption] = useState("none");
    
    const updateSearchValue = (value) => {

        switch (value) {
            case "delete":
                setSearchValue((prev) => prev.slice(0, -1));
                break;

            case "space":
                if (searchValue.trim().length === 0 || searchValue.slice(0, -1) === " ")
                    break;
                setSearchValue((prev) => prev + " ");
                break;
            
            case "clear":
                setSearchValue("");
                break;

            default:
                setSearchValue((prev) => prev + value);
                break;
        }
    };

    const clearSearchValue = () => {
        setSearchValue("");
    };

    const saveSearchValue = () => {
        setSavedSearchValue(searchValue);
    };

    const updateSortOption = () => {
        setSortOption((prevSortOption) => {
            switch (prevSortOption) {
                case "none":
                    return "alphabetical";
                case "alphabetical":
                    return "reverse alphabetical";
                case "reverse alphabetical":
                    return "none";
                default:
                    return "none";
            }
        });
    };

    return (
        <NavigationContext.Provider value={{
            searchValue, setSearchValue, updateSearchValue, clearSearchValue, saveSearchValue, savedSearchValue,
            sortOption, updateSortOption
        }}>
            {children}
        </NavigationContext.Provider>
    );
};
