
import Modal from 'react-modal';
import '../styles/SearchModal.css'
import { BsXLg } from "react-icons/bs";
import GameSearch from './GameSearch';
import { useContext } from 'react';
import { SearchContext } from '../context/SearchContext';

export default function SearchModal({showModal, toggleModal}) {
    
    let {search, keyboardClick, submit, clear} = useContext(SearchContext)

    return (
        <Modal
            isOpen={showModal}
            toggle={toggleModal}
            className='search-modal'
            overlayClassName='search-modal-overlay'
        >
            <div className='search-modal-container'>
                
                {/* Close Button */}
                <span onClick={clear}>
                    <BsXLg className='search-modal-close' onClick={toggleModal} />
                </span>

                {/* Modal Body */}
                <div className='search-modal-body'>

                    {/* Search Bar */}
                    <div className='search-bar'>
                        {
                            search != "" ?
                                <span className='search-text'>
                                    {search}
                                </span>
                            :
                                <span className='search-placeholder'>
                                    Enter a game or author name
                                </span>
                        }
                    </div>

                    {/* Keyboard */}
                    <div className='search-keyboard'>
                        <GameSearch />
                    </div>

                </div>

                {/* Modal Footer */}
                <div className='search-modal-footer'>

                    {/* Cancel */}
                    <span onClick={toggleModal}>
                        <div className='search-modal-button cancel'
                            onClick={clear}>
                            Cancel
                        </div>
                    </span>

                    {/* Submit */}
                    <span onClick={toggleModal}>
                        <div className='search-modal-button submit'
                            onClick={submit}>
                            Submit
                        </div>
                    </span>

                </div>

            </div>
        </Modal>

    )
}