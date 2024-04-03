
import Modal from 'react-modal';
import { BsArrowLeft } from "react-icons/bs";
import '../styles/FilterModal.css'
import { useContext, useState } from 'react';
import { FilterContext } from '../context/FilterContext';

function FilterModal({showModal, toggleModal}) {

    const {filter, updateFilter, clearFilter, submitFilter} = useContext(FilterContext)    

    const accordionData = [
        {
            title: 'Players',
            options: ['Single Player', 'Multiplayer'],
        },
        {
            title: 'Genre',
            options: ['Platformer', 'Strategy', 'First Person Shooter', 'Survival'],
        },
        {
            title: 'Year of Development',
            options: ['2024'],
        }
    ]

    return (
        <Modal
            isOpen={showModal}
            toggle={toggleModal}
            className='filter-modal'
            overlayClassName='filter-modal-overlay'
        >
            <div className='filter-modal-container'>

                {/* Back Button */}
                <div className='filter-modal-back-container'>
                    <span className='back-button-title filter-modal-back' onClick={toggleModal}>
                        <span onClick={clearFilter}>
                            <BsArrowLeft className='back-button-icon' />
                            &nbsp; Back
                        </span>
                    </span>
                </div>

                {/* Modal Body */}
                <div className='filter-modal-body'>
                    <div className='filter-modal-header'>
                        <span>Filter By:</span>
                    </div>
                    <div className='filter-modal-accordion'>
                        {
                            accordionData.map((accordion) => {
                                return (
                                    <div key={accordion.title} className='accordion-item-container'>
                                        <div className='accordion-title'>
                                            {accordion.title}
                                        </div>
                                        {
                                            (accordion.options.map((option) => {
                                                return (
                                                    <div key={option} className={Object.values(filter).includes(option) ? 'accordion-item selected' : 'accordion-item'} 
                                                        onClick={() => updateFilter(accordion.title, option)}
                                                    >
                                                        <label>
                                                            {option}
                                                        </label>
                                                    </div>
                                                )
                                            }))
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

                {/* Modal Footer */}
                <div className='filter-modal-footer'>
                    
                    {/* Cancel */}
                    <span onClick={clearFilter}>
                        <div className='filter-modal-button cancel'>
                            Clear Filters
                        </div>
                    </span>

                    {/* Submit */}
                    <span onClick={toggleModal}>
                        <div className='filter-modal-button submit'
                            onClick={submitFilter}>
                            Submit
                        </div>
                    </span>

                </div>

            </div>
        </Modal>

    )

}

export default FilterModal