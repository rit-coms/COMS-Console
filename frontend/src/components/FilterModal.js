
import Modal from 'react-modal';
import { BsArrowLeft } from "react-icons/bs";
import '../styles/FilterModal.css'
import { useContext } from 'react';
import { FilterContext } from '../context/FilterContext';
import { PageContext } from '../context/PageContext';

function FilterModal({showModal, toggleModal}) {

    const { filter, updateFilter, clearFilter, submitFilter } = useContext(FilterContext)    
    const { changePage } = useContext(PageContext)

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
                    <span onClick={toggleModal}>
                        <span onClick={() => changePage('home')}>
                            <button className='back-button-title filter-modal-back' onClick={clearFilter}>
                                <BsArrowLeft className='back-button-icon' />
                                &nbsp; Back
                            </button>
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
                                                    <button key={option} className={Object.values(filter).includes(option) ? 'accordion-item selected filter-option-' + (option.replace(/\ /g, "-").toLowerCase()) : 'accordion-item filter-option-' + (option.replace(/\ /g, "-").toLowerCase())} 
                                                        onClick={() => updateFilter(accordion.title, option)}
                                                    >
                                                        <label className='title'>
                                                            {option}
                                                        </label>
                                                    </button>
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
                        <span onClick={() => changePage('home')}>
                            <button className='filter-modal-button cancel'>
                                Clear Filters
                            </button>
                        </span>
                    </span>

                    {/* Submit */}
                    <span onClick={toggleModal}>
                        <span onClick={() => changePage('home')}>
                            <button className='filter-modal-button submit'
                                onClick={submitFilter}>
                                Submit
                            </button>
                        </span>
                    </span>

                </div>

            </div>
        </Modal>

    )

}

export default FilterModal