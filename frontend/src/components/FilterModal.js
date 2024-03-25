
import Modal from 'react-modal';
import { BsArrowLeft } from "react-icons/bs";
import '../styles/FilterModal.css'
import { useState } from 'react';

function FilterModal({showModal, toggleModal}) {
    

    // TODO: Make Context for filter

    const [selected, setSelected] = useState({
        players: "",
        genre: "",
        year: ""
    })

    const updateSelection = (accordion, option) => {
        switch (accordion) {
            case 'Players':
                setSelected({...selected, players: option})
                break
            case 'Genre':
                setSelected({ ...selected, genre: option })
                break
            case 'Year of Development':
                setSelected({ ...selected, year: option })
                break
        } 
    }

    const clearSelection = () => {
        setSelected({players:"", genre:"", year:""})
    }

    const submitSelection = () => {
        getFilterResults()
        clearSelection()
    }

    const getFilterResults = () => {
        console.log("filter w: ", selected)
    }


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
                    <span className='back-button-title' onClick={toggleModal}>
                        <span onClick={clearSelection}>
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
                                    <div className='accordion-item-container'>
                                        <div className='accordion-title'>
                                            {accordion.title}
                                        </div>
                                        {
                                            (accordion.options.map((option) => {
                                                return (
                                                    <div className={Object.values(selected).includes(option) ? 'accordion-item selected' : 'accordion-item'} 
                                                        onClick={() => updateSelection(accordion.title, option)}
                                                    >
                                                        <label>
                                                            {/* { Object.values(selected).includes(option) ?
                                                                <BsCircleFill className='radio-icon icon-selected' />
                                                            :
                                                                <BsCircle className='radio-icon' />
                                                            } */}
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
                    <span onClick={clearSelection}>
                        <div className='filter-modal-button cancel'>
                            Clear Filters
                        </div>
                    </span>

                    {/* Submit */}
                    <span onClick={toggleModal}>
                        <div className='filter-modal-button submit'
                            onClick={submitSelection}>
                            Submit
                        </div>
                    </span>

                </div>

            </div>
        </Modal>

    )

}

export default FilterModal