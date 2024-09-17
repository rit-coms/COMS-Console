
import Modal from 'react-modal';
import '../styles/SearchModal.css'
import { BsXLg } from "react-icons/bs";
import GameSearch from './GameSearch';
import { useContext } from 'react';
import { SearchContext } from '../context/SearchContext';
import { PageContext } from '../context/PageContext';

export default function SearchModal({showModal, toggleModal}) {
    
    let { search, submit, clear } = useContext(SearchContext)
    const { changePage } = useContext(PageContext)

    return (
        <Modal
            isOpen={showModal}
            toggle={toggleModal}
            className='search-modal'
            overlayClassName='search-modal-overlay'
        >
            <div className='search-modal-container'>
                
                {/* Close Button */}
                <span onClick={() => changePage('home')}>
                    <span onClick={toggleModal}>
                        <button className='search-modal-close'><BsXLg onClick={clear}/></button>
                    </span>
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
                    <span onClick={() => changePage('home')}>
                        <span onClick={toggleModal}>
                            <button className='search-modal-button cancel'
                                onClick={clear}>
                                Cancel
                            </button>
                        </span>
                    </span>

                    {/* Submit */}
                    <span onClick={() => changePage('home')}>
                        <span onClick={toggleModal}>
                            <button className='search-modal-button submit'
                                onClick={submit}>
                                Submit
                            </button>
                        </span>
                    </span>

                </div>

            </div>
        </Modal>

    )
}