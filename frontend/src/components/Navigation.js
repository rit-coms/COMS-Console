import { BsSliders2, BsSortDown, BsTriangle, BsXLg } from "react-icons/bs";
import React, { useState } from 'react';
import '../styles/Navigation.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import SearchModal from "./SearchModal";
import { useContext } from "react";
import { SortContext } from "../context/SortContext";
import FilterModal from "./FilterModal";
import { SearchContext } from "../context/SearchContext";
import { PageContext } from "../context/PageContext";

export default function Navigation() {

    const [showSearchModal, setShowSearchModal] = useState(false)
    const [showFilterModal, setShowFilterModal] = useState(false)
    const { updateSort } = useContext(SortContext)
    let { search, clear } = useContext(SearchContext)
    const { changePage } = useContext(PageContext)

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
                    <span onClick={() => changePage('search modal')}>
                        <button className="search-bar" onClick={() => setShowSearchModal(!showSearchModal)}>
                            <div className="search-title" onClick={clear}>
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
                    </span>

                    {/* Filter and Sort Buttons */}
                    <div className="search-query-buttons">
                        <span onClick={() => changePage('filter modal')}>
                            <button className="search-button search-filter-button" onClick={() => setShowFilterModal(!showFilterModal)}>
                                <BsSliders2 />
                            </button>
                        </span>
                        <button className="search-button search-sort-button" onClick={updateSort}>
                            <BsSortDown />
                        </button>
                    </div>
                </div>
            </nav>
        </div>
    )
}