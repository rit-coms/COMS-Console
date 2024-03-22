import Modal from 'react-modal';
import React, { useState } from 'react';
import "../styles/GameInfoModal.css"
import { BsXLg } from "react-icons/bs";

const GameInfoModal = ({ isOpen, toggleModal, game }) => {

	// to suppress warning error
	Modal.setAppElement('#root')

	console.log("URL: ", game.image)
	console.log("IS PLACEHOLDER IMG: ", game.image.indexOf('placeholder') > 0)
	console.log("IS IMG FORMAT: ", game.image.indexOf('.png') > 0 || game.image.indexOf('.jpg') > 0)
	console.log("-----------------")
	console.log(game.image.indexOf('placeholder') < 0 && game.image.indexOf('.jpg') > 0)
	console.log("************")

	const playGame = () => {
		console.log("PLAY: ", game.title)
	}
	
	return (
		<Modal
			isOpen={isOpen}
			toggle={toggleModal}
			className='game-info-modal'
			overlayClassName='game-info-modal-overlay'
		>
			{/* header, body, footer */}
			<div className='game-info-modal-container'>

				{/* Close Button */}
				<BsXLg className='game-info-modal-close' onClick={toggleModal} />
				
				<div className='game-info-modal-body'>
					<div className='game-info-modal-image'>
						{
							(game.image.indexOf('placeholder') < 0 && game.image.indexOf('.jpg') > 0) ?
								<img className='game-image' src={game.image} />
							: 
								<img className='game-image' />
						}
					</div>
					<div className='game-info-modal-game-details'>

						<div className='game-info-modal-header'>
							<h3 className='game-title'>{game.title}</h3>
							<span className='game-author'><i>{game.author}</i></span> <br />
							<span className='game-release-date'>{game.release_date}</span>
						</div>

						<div className='game-info-modal-attributes'>
							{game.is_multiplayer ?
								<div className='game-info-modal-pill'>multiplayer</div>
								: <div className='game-info-modal-pill'>single player</div>
							}
							<div className='game-info-modal-pill'>genre</div>
						</div>

						<div className='game-info-modal-summary'>
							{
								game.summary == "" ?
									<p>
										Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
										Duis ac orci sed purus pellentesque cursus ut nec leo. 
										Phasellus at risus quis ante auctor facilisis. Fusce iaculis 
										leo eget dui finibus, volutpat tincidunt erat euismod. 
										Donec accumsan eget ligula at interdum. Ut tincidunt bibendum 
										interdum. Morbi faucibus volutpat pharetra. Vivamus commodo 
										pharetra elit ut venenatis.
									</p>
								: 
									<p>{game.summary}</p>
							}
						</div>
					</div>
				</div>
				<div className='game-info-modal-footer'>
					<div className='game-info-modal-play-button' onClick={toggleModal}>
						<div className='game-info-modal-play-text' onClick={playGame}>
							Play
						</div>
					</div>
				</div>
			</div>
		</Modal>	
    );
};

export default GameInfoModal;
