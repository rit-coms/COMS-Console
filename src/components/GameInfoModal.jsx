import Modal from 'react-modal';
import React, { useContext, useEffect, useState } from 'react';
import "../styles/GameInfoModal.css"
import { BsXLg } from "react-icons/bs";
import { PageContext } from '../context/PageContext';
import { invoke } from '@tauri-apps/api/tauri';

const GameInfoModal = ({ isOpen, toggleModal, game}) => {

	// to suppress warning error
	Modal.setAppElement('#root')

	const {changePage} = useContext(PageContext);

	// TODO: reimplement for tauri
	// const playGame = () => {
		
	// 	fetch('http://127.0.0.1:8000/launch?id=' + game.id)
	// 	.then(response => {
	// 		if(response.ok)
	// 		{
	// 			console.log("PLAY: ", game.title)
	// 		} else {
	// 			console.log("Error triggering script:", response.statusText)
	// 		}
			
	// 	})
	// 	.catch(error => {
	// 		console.error("Error:" + error)
	// 	})
	// }
	const playGame = async id => {
		invoke('play_game', {id: game.id})
	}
	
	return (
		<Modal
			isOpen={isOpen}
			toggle={toggleModal}
			className='game-info-modal'
			overlayClassName='game-info-modal-overlay'
		>
			<div className='game-info-modal-container'>

				{/* Close Button */}
				<button className={'game-info-modal-close ' + isOpen} onClick={() => {
					toggleModal()
					changePage('home')
				}} >
					<BsXLg />
				</button>
				
				{/* Modal Body */}
				<div className='game-info-modal-body'>

					{/* Game Image */}
					<div className='game-info-modal-image'>
						{
							true ?
								<img className='game-image' src={game.cover_image} />
							: 
								// default is placeholder image
								<img className='game-image' />
						}
					</div>

					{/* Game Details */}
					<div className='game-info-modal-game-details'>

						{/* Header */}
						<div className='game-info-modal-header'>
							<h3 className='game-title'>
								{game.title}
							</h3>
							<span className='game-author'><i>{game.author}</i></span> <br />
							<span className='game-release-date'>{game.release_date}</span>
						</div>

						{/* Attributes */}
						<div className='game-info-modal-attributes'>
							{
								game.multiplayer ?
									<div className='game-info-modal-pill'>multiplayer</div>
									: <div className='game-info-modal-pill'>single player</div>
							}
							{
								game.genres.map((genre) => {
									return <div className='game-info-modal-pill'>{genre}</div>
								})
							}
							
						</div>

						{/* Summary */}
						<div className='game-info-modal-summary'>
							{
								game.summary == "" ?
									// default is lorem ipsum
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

				{/* Footer */}
				<div className='game-info-modal-footer'>
					<button className={'game-info-modal-play-button ' + isOpen} 
						onClick={() => {
							toggleModal()
							playGame()
							changePage('home')
						}}
					>
						<div className='game-info-modal-play-text'>
							Play
						</div>
					</button>
				</div>

			</div>
		</Modal>	
    );
};

export default GameInfoModal;
