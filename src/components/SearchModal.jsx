import React, { useEffect } from "react";
import { useNavigationContext } from "../context/contexts";
import { Keyboard, Modal, Search } from "quackbox-design-system";
import "../styles/SearchModal.css";

export default function SearchModal({showModal, closeModal}) {

    if (!showModal)
        return null;

    const { searchValue, setSearchValue, updateSearchValue, clearSearchValue, saveSearchValue, savedSearchValue } = useNavigationContext();

    useEffect(() => {
        if (savedSearchValue !== "")
            setSearchValue(savedSearchValue);
    }, []);

    const handleKeyPress = (key) => {
        updateSearchValue(key);
    };

    const handleOnClose = () => {
        closeModal();
        searchValue !== savedSearchValue && clearSearchValue();
    };

    const handleOnConfirmation = () => {
        closeModal();
        saveSearchValue();
    };

    return (
        <div className="modal-container">
            <Modal
                isOpen={showModal}
                overlay
                title={"Search for a game"}
                alignTitle="center"
                onClose={handleOnClose}
                confirmLabel="Search"
                confirmLabelColorPrimary
                onConfirmation={handleOnConfirmation}
                alignContentCenter
                dataId="search-modal"
            >

                <div className="keyboard-container">
                    <Search 
                        onClick={() => {}} 
                        onChange={() => {}}
                        value={searchValue}
                        dataId="keyboard-search-bar" 
                    />
                    <Keyboard onKeyPress={(e) => handleKeyPress(e)} dataId="keyboard" />
                </div>
            </Modal>
        </div>
    );
}
