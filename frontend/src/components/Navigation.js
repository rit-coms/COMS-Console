import { BsSliders2, BsSortDown, BsTriangle, BsXLg } from "react-icons/bs";
import React, { useState } from 'react';
import '../styles/Navigation.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import SearchModal from "./SearchModal";
import { useContext } from "react";
import { SortContext } from "../context/SortContext";
import FilterModal from "./FilterModal";
import { SearchContext } from "../context/SearchContext";

export default function Navigation() {

    const [showSearchModal, setShowSearchModal] = useState(false)
    const [showFilterModal, setShowFilterModal] = useState(false)
    const {updateSort} = useContext(SortContext)
    let {search, clear} = useContext(SearchContext)

    return (
        <div>
            {/* Navigation Modals */}
            <SearchModal showModal={showSearchModal} toggleModal={() => setShowSearchModal(false)} />
            <FilterModal showModal={showFilterModal} toggleModal={() => setShowFilterModal(false)} />

            {/* Navigation Bar */}
            <nav className="navigation-bar">

                {/* Duck */}
                <div className="mascot" ></div >

                {/* Navigation Container */}
                <div className="navigation-container">

                    {/* Search Bar */}
                    <button className="search-bar" onClick={clear}>
                        <div className="search-title" onClick={() => setShowSearchModal(!showSearchModal)}>
                            {
                                search != "" ?
                                search : <span>Search</span>
                            }
                        </div>

                        {
                            search != ""
                                ? <BsXLg className="search-icon" onClick={clear}/>
                                : <BsTriangle className="search-icon no-fill-triangle" />
                        }
                        
                    </button>

                    {/* Filter and Sort Buttons */}
                    <div className="search-query-buttons">
                        <BsSliders2 className="search-button search-filter-button" onClick={()=> setShowFilterModal(!showFilterModal)} />
                        <BsSortDown className="search-button search-sort-button" onClick={updateSort} />
                    </div>
                </div>
            </nav>
        </div>
    )
}