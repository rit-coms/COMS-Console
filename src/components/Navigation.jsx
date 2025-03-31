import React from "react";
import { useModal } from "../hooks/useModal";
import { useNavigationContext, usePageContext } from "../context/contexts";
import SearchModal from "./SearchModal";
import { IconButton, Logo, Search } from "quackbox-design-system";
import "../styles/Navigation.css";

export default function Navigation() {

    const [showSearchModal, openSearchModal, closeSearchModal] = useModal();
    const {updatePage} = usePageContext();

    const handleOpenSearchModal = () => {
        openSearchModal();
        setTimeout(() => {
          updatePage("search modal");
        }, 0);
    };

    const handleCloseSearchModal = () => {
        closeSearchModal();
        setTimeout(() => {
            updatePage("home page");
        }, 0);
    };

    const { savedSearchValue, sortOption, updateSortOption } = useNavigationContext();

    const getSortIcon = () => {
        switch (sortOption) {
            case "none": return "LuArrowUpDown";
            case "alphabetical": return "LuArrowDownAZ";
            case "reverse alphabetical": return "LuArrowUpAZ";
            default: return "LuArrowUpDown";
        }
    };

    return (
        <>
            <SearchModal showModal={showSearchModal} closeModal={handleCloseSearchModal}/>
            <div className="navigation-container">
                <div className="navigation-logo">
                    <Logo src={"src/assets/duck.png"}/>
                </div>

                <div className="navigation-search">
                    <Search 
                        onChange={() => {}} 
                        onClick={handleOpenSearchModal} 
                        placeholder={savedSearchValue === "" ? "Search" : savedSearchValue} 
                        dataId="navigation-search-bar"
                    />
                    <IconButton 
                        iconName={getSortIcon()} 
                        dataId="navigation-sort-button"
                        onClick={updateSortOption}
                    />
                    <IconButton 
                        iconName={"LuListFilter"} 
                        disabled
                        dataId="navigation-filter-button"
                    />
                    
                </div>

                <div className="navigation-menu">
                    <IconButton 
                        iconName={"LuMenu"} 
                        disabled 
                        dataId="navigation-menu-button"
                    />
                </div>
            </div>
        </>
    );
}
