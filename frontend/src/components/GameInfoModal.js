import Modal from 'react-modal';
import React, { useState } from 'react';
import "../styles/GameInfoModal.css"

const GameInfoModal = ({ isOpen, toggleModal, game }) => {

	// to suppress warning error
	Modal.setAppElement('#root')
	
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
			minWidth: '600px'
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
			toggle={toggleModal}
			style={modalStyles}
		>
			<div>
				<span 
					role='button' onClick={toggleModal} 
					style={closeButtonStyles}
					aria-label='Close'
				>
					&#10006;
				</span>
				<div>
					<img height='120px' width='120px' className='picture'
						style={{display:'block', margin:'auto'}}
						src='https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2F7%2F74%2FWhite_domesticated_duck%2C_stretching.jpg'
					/>
				</div>
				<div className='text-wrapper-2'>{game.title}</div>
				<div className='text-wrapper-3'>{game.author}</div>
				<div className='text-wrapper-4'>{game.release_date}</div>
				<div className="rectangle-2" />
				<div className="container">
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
		</Modal>	
    );
};

export default GameInfoModal;
