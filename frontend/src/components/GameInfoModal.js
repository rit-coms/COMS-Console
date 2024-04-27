import Modal from 'react-modal';
import React, { useContext, useEffect, useState } from 'react';
import "../styles/GameInfoModal.css"
import { BsXLg } from "react-icons/bs";
import { PageContext } from '../context/PageContext';

const GameInfoModal = ({ isOpen, toggleModal, game, gameInfo}) => {

	let nullString = "{\"title\":\"placeholder\",\"id\":\"97b3efec-c3b5-4bbc-a4c9-d5aa4ad34d67\",\"file_path\":\"test\",\"author\":\"test\",\"summary\":\"testtestsetsetsetsetsetsetsetsetsetsetsetsetsertsetsetsetse\",\"release_date\":0,\"is_multiplayer\":true,\"genres\":[],\"cover_image\":\"test\",\"times_played\":0,\"last_played\":\"\"}";
	const nullObj = JSON.parse(nullString);
	if(!gameInfo)
	{
		gameInfo = nullObj;
	}

	// to suppress warning error
	Modal.setAppElement('#root')

	const {changePage} = useContext(PageContext);

	const playGame = () => {
		
		fetch('http://127.0.0.1:8000/launch?id=' + game.id)
		.then(response => {
			if(response.ok)
			{
				console.log("PLAY: ", game.title)
			} else {
				console.log("Error triggering script:", response.statusText)
			}
			
		})
		.catch(error => {
			console.error("Error:" + error)
		})
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
							(game.cover_image.indexOf('placeholder') < 0 && game.cover_image.indexOf('.jpg') > 0) ?
								<img className='game-image' src={"https://raw.githubusercontent.com/rit-coms/COMS-Console/imagine-demo-branch" + game.cover_image.slice(54)} />
							: 
								// default is placeholder image
								<img className='game-image' />
						}
					</div>

					{/* Game Details */}
					<div className='game-info-modal-game-details'>

						{/* Header */}
						<div className='game-info-modal-header'>
							<h3 className='game-title'>{
							gameInfo['title']
							}</h3>
							<span className='game-author'><i>{gameInfo['author']}</i></span> <br />
							<span className='game-release-date'>{gameInfo['release_date'].toString()}</span>
						</div>

						{/* Attributes */}
						<div className='game-info-modal-attributes'>
							{Boolean(gameInfo['is_multiplayer']).valueOf() ?
								<div className='game-info-modal-pill'>multiplayer</div>
								: <div className='game-info-modal-pill'>single player</div>
							}
							{
								game.genres.map(genre => {
									return (<div className='game-info-modal-pill'>{genre}</div>)
								})
							}
							
						</div>

						{/* Summary */}
						<div className='game-info-modal-summary'>
							{
								gameInfo['summary'] == "" ?
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
									<p>{gameInfo['summary']}</p>
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
