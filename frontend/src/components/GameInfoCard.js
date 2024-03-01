import Modal from 'react-modal';
import React, { useState } from 'react';
// if this doesnt work make sure you installed "npm install react-modal"

const GameModal = ({ isOpen, onRequestClose, game }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Game Details"
        >
            {game && (
                <div>
                    <h2>{game.name}</h2>
                    <p>This is the game information card that will pop up when a game is selected from the game gallery</p>
                    <button onClick={onRequestClose}>Close Modal</button>
                </div>
            )}
        </Modal>
    );
};

export default GameModal;

//		This is the game information card that will pop up when a game is selected from the game gallery
