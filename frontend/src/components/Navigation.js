import { BsSliders2 } from "react-icons/bs";
import { BsSortDown } from "react-icons/bs";
import { BsTriangle } from "react-icons/bs";
import React, { useState } from 'react';
import '../styles/Navigation.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import SearchModal from "./SearchModal";
import { useContext } from "react";
import { SortContext } from "../context/SortContext";

export default function Navigation() {

    const [showModal, setShowModal] = useState(false)
    const {updateSort} = useContext(SortContext)

    const filter = () => {
        console.log("filter")
    }

    return (
        <div>
            {/* Search Modal */}
            <SearchModal showModal={showModal} toggleModal={() => setShowModal(false)} />

            {/* Navigation Bar */}
            <nav className="navigation-bar">
                {/* Duck */}
                <div className="mascot" ></div >

                {/* Navigation Container */}
                <div className="navigation-container">

                    {/* Search Bar */}
                    <div className="search-bar">
                        <div className="search-title" onClick={() => setShowModal(!showModal)}>
                            Search
                        </div>
                        <BsTriangle className="search-icon no-fill-triangle" />
                    </div>

                    {/* Filter and Sort Buttons */}
                    <div className="search-query-buttons">
                        <BsSliders2 className="search-filter-button" onClick={filter} />
                        <BsSortDown className="search-sort-button" onClick={updateSort} />
                    </div>
                </div>
            </nav>
        </div>
    )
}