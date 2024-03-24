import React, { useState } from 'react';
import GameThumbnail from "./GameThumbnail";
import { BsArrowLeft } from "react-icons/bs";
import '../styles/GameGallery.css';
import games from '../games.json'
import { useContext } from 'react';
import { SortContext } from '../context/SortContext';
import * as Sort from '../utils/SortGames';

export default function GameGallery() {

	// TODO: Make API call to get games
	// let games = [
	// 	{
	// 		"id": "duck-duck-go",
	// 		"title": "duck duck go",
	// 		"image": "./assets/placeholder.jpg"
	// 	},
	// 	{
	// 		"id": "go-duck",
	// 		"title": "go duck",
	// 		"image": "./assets/placeholder.jpg"
	// 	},
	// 	{
	// 		"id": "snake-but-ducks",
	// 		"title": "Snake! but ducks",
	// 		"image": "./assets/placeholder.jpg"
	// 	},
	// 	{
	// 		"id": "duck-duck-go6",
	// 		"title": "duck duck go",
	// 		"image": "./assets/placeholder.jpg"
	// 	},
	// 	{
	// 		"id": "go-duck4",
	// 		"title": "go duck",
	// 		"image": "./assets/placeholder.jpg"
	// 	},
	// 	{
	// 		"id": "snake-but-ducks9",
	// 		"title": "Snake! but ducks",
	// 		"image": "./assets/placeholder.jpg"
	// 	},
	// 	{
	// 		"id": "duck-duck-go1",
	// 		"title": "duck duck go",
	// 		"image": "./assets/placeholder.jpg"
	// 	},
	// 	{
	// 		"id": "go-duck2",
	// 		"title": "go duck",
	// 		"image": "./assets/placeholder.jpg"
	// 	},
	// 	{
	// 		"id": "snake-but-ducks3",
	// 		"title": "Snake! but ducks",
	// 		"image": "./assets/placeholder.jpg"
	// 	},
	// 	{
	// 		"id": "duck-duck-go11",
	// 		"title": "duck duck go",
	// 		"image": "./assets/placeholder.jpg"
	// 	},
	// 	{
	// 		"id": "go-duck21",
	// 		"title": "go duck",
	// 		"image": "./assets/placeholder.jpg"
	// 	},
	// 	{
	// 		"id": "snake-but-ducks31",
	// 		"title": "Snake! but ducks",
	// 		"image": "./assets/placeholder.jpg"
	// 	}
	// ]
  
	const [showFullGallery, setShowFullGallery] = useState(false);
	const {sort} = useContext(SortContext)

    const handleSeeAllClick = () => {
        setShowFullGallery(!showFullGallery);
    };

	const sortGames = (games) => {
		switch (sort) {
			case "Name - Alphabetical":
				return Sort.sortAlphabetical(games)
			case "Name - Reverse Alphabetical":
				return Sort.sortReverseAlphabetical(games)
			case "Year - Newest to Oldest":
				return Sort.sortLatestReleaseDate(games)
			case "Year - Oldest to Newest":
				return Sort.sortOldestReleaseDate(games)
			case "Most Played":
				return Sort.sortMostPlayed(games)
			case "Least Played":
				return Sort.sortLeastPlayed(games)
			default:
				return Sort.sortLastPlayed(games)
		}
	}

	return (
		<div className='game-gallery'>
			
			{/* See All || null */}
			{!showFullGallery ?
				<div className="see-all-container" >
					<div className='game-gallery-card see-all-button' onClick={handleSeeAllClick}>
						See All
					</div>	
				</div>
				: null
			}

			{/* Game Gallery View */}
			<div className='game-gallery-container'>

				{/* Back Button || null */}
				{showFullGallery ?
					<div className='game-gallery-back-container' onClick={handleSeeAllClick}>
						<span className='back-button-title'>
							<BsArrowLeft className='back-button-icon'/>
							&nbsp; Back
						</span>
					</div>
					: null
				}

				{/* Sort Method || null */}
				{
					sort != 'None' && !showFullGallery ?
						<div className='game-gallery-sort'>
							<p>Sorting by: {sort}</p>
						</div>
					: null
				}
				

				{/* Full Vertical Gallery || Select Horizontal Gallery */}
				<div className={showFullGallery ? 'game-carousel full-gallery' : 'game-carousel'}>
					{showFullGallery
						? sortGames(games).map((game) =>
							<div key={game.id} className="game-gallery-card">
								<GameThumbnail key={game.id} game={game}></GameThumbnail>
							</div>
						)
						// TODO reserve for previous 6 games played
						: sortGames(games).slice(0, 6).map((game) =>
							<div key={game.id} className="game-gallery-card">
								<GameThumbnail key={game.id} game={game}></GameThumbnail>
							</div>
						)
					}
				</div>

			</div>
		</div>
    );
}