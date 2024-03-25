import { BsSliders2 } from "react-icons/bs";
import { BsSortDown } from "react-icons/bs";
import { BsTriangle } from "react-icons/bs";
import React, { useState } from 'react';
import '../styles/Navigation.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import SearchModal from "./SearchModal";
import { useContext } from "react";
import { SortContext } from "../context/SortContext";
import FilterModal from "./FilterModal";

export default function Navigation() {

    const [showSearchModal, setShowSearchModal] = useState(false)
    const [showFilterModal, setShowFilterModal] = useState(false)
    const {updateSort} = useContext(SortContext)

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
                    <div className="search-bar">
                        <div className="search-title" onClick={() => setShowSearchModal(!showSearchModal)}>
                            Search
                        </div>
                        <BsTriangle className="search-icon no-fill-triangle" />
                    </div>

                    {/* Filter and Sort Buttons */}
                    <div className="search-query-buttons">
                        <BsSliders2 className="search-filter-button" onClick={()=> setShowFilterModal(!showFilterModal)} />
                        <BsSortDown className="search-sort-button" onClick={updateSort} />
                    </div>
                </div>
            </nav>
        </div>
    )
}