import Modal from 'react-modal';
import React, { useState } from 'react';
import "./GameInfoCard.css";
// if this doesnt work make sure you installed "npm install react-modal"

const GameModal = ({ isOpen, onRequestClose, game }) => {
	const modalStyles = {
        content: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			width: '40%', // Adjust the width as needed
			height: '60%', // Adjust the height as needed
			position: 'fixed',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
			borderRadius: '22px',
			overflow: 'visible',
			"min-width": '600px'
        },
    };

	const closeButtonStyles = {
        cursor: 'pointer',
        alignSelf: 'flex-end',
        fontSize: '20px',
		position: 'fixed',
		top: '20px',
		right: '20px' // Adjust margin as needed
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
                <div>
					{/* <img height="120px" width="120px" 
						style={{ display: 'block', margin: 'auto' }}
						src='https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2F7%2F74%2FWhite_domesticated_duck%2C_stretching.jpg&f=1&nofb=1&ipt=fe16a3ffa3dbfffac1161692adff97ed1ec76957bdad784cfdb37813d1a8a561&ipo=images'>
					</img> */}
					<div className="picture">
					<img height="120px" width="120px" 
						style={{ display: 'block', margin: 'auto' }}
						src='https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2F7%2F74%2FWhite_domesticated_duck%2C_stretching.jpg&f=1&nofb=1&ipt=fe16a3ffa3dbfffac1161692adff97ed1ec76957bdad784cfdb37813d1a8a561&ipo=images'></img>
					</div>
					<div >
					<div className="text-wrapper-2">{game.name}</div>
					<div className="text-wrapper-3">{game.author}</div>
					<div className="text-wrapper-4">Year uploaded</div>
					<div className="rectangle-2" />
					<div class="container">
						<div className="rectangle-3" >Multiplayer</div>
						<div className="rectangle-4">Genre</div>
					</div>
					<p className="text-wrapper">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ac orci sed purus pellentesque cursus ut
						nec leo. Phasellus at risus quis ante auctor facilisis. Fusce iaculis leo eget dui finibus, volutpat
						tincidunt erat euismod.
					</p>
					<div className="text-wrapper-5">Play</div>
					</div>
                </div>
				</div>
            )}
        </Modal>
    );
};

export default GameModal;

//		This is the game information card that will pop up when a game is selected from the game gallery
