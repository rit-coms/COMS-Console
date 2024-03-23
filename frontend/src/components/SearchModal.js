
// import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Modal from 'react-modal';
import '../styles/SearchModal.css'
import { BsXLg } from "react-icons/bs";
import GameSearch from './GameSearch';
import { useState } from 'react';

export default function SearchModal({showModal, toggleModal}) {
    
    let [search, setSearch] = useState("")

    const keyboardClick = (key) => {

        if (key == 'space' && search.length == 0)
            return
        
        if (key == 'del') {
            setSearch(search.slice(0, -1))

        } else if (key == 'space') {
            setSearch(search += " ")

        } else {
            setSearch(search += key)

        }
    }

    const submit = () => {
        if (search != "")
            console.log("final search", search)
        clear()
    }

    const clear = () => {
        setSearch("")
    }

    const games = [
        {
            name: "QuackAttack",
            author: "Zoe"
        },
        {
            name: "BossDuck",
            author: "Jeff"
        },
        {
            name: "QuackQuackGo",
            author: "Jeff"
        },
        {
            name: "DuckRecker",
            author: "Adrian"
        },
    ];

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
                        <GameSearch keyboardClick={keyboardClick} />
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