import Modal from 'react-modal';
import React, { useState } from 'react';
// if this doesnt work make sure you installed "npm install react-modal"

const GameModal = ({ isOpen, onRequestClose, game }) => {
	const modalStyles = {
        content: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '60%', // Adjust the width as needed
            margin: 'auto',
        },
    };

	const columnStyles = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginLeft: '20px', // Adjust the margin as needed
		padding: '10px',
    };

	const closeButtonStyles = {
        cursor: 'pointer',
        alignSelf: 'flex-end',
        fontSize: '20px',
		position: 'fixed',
		top: '10px',
		right: '10px' // Adjust margin as needed
    };
	
	return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Game Details"
			style={modalStyles}
        >
            {game && (
				<div>
					<span
                        role="button"
                        aria-label="Close"
                        onClick={onRequestClose}
                        style={closeButtonStyles}
                    >
                        &#10006;
                    </span>
                <div  style={{ display: 'flex' }}>
                    <div style={{ marginRight: '20px' }}>
                        <img
                            height="300px"
                            width="300px"
                            src='https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2F7%2F74%2FWhite_domesticated_duck%2C_stretching.jpg&f=1&nofb=1&ipt=fe16a3ffa3dbfffac1161692adff97ed1ec76957bdad784cfdb37813d1a8a561&ipo=images'
                            alt="duck"
                        />
                    </div>
					<div style={columnStyles}>
						<div>
							<h2>{game.name}</h2>
							<h3>{game.author}</h3>
						</div>
					
                    <p>This is the game information card that will pop up when a game is selected from the game gallery</p>
					</div>
                </div>
				</div>
            )}
        </Modal>
    );
};

export default GameModal;

//		This is the game information card that will pop up when a game is selected from the game gallery
