
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import GameSearchOverlay from '../components/GameSearchOverlay';

export default function SearchModal({showModal, toggleModal}) {
    
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
            className="modal-fullscreen search-modal"
        >
            <ModalBody>
                <GameSearchOverlay games={games}></GameSearchOverlay>
            </ModalBody>

            <ModalFooter>
                <Button color="primary" onClick={toggleModal}>
                    Search
                </Button>
                <Button color="secondary" onClick={toggleModal}>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    )
}