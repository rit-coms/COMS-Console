import React, { useState, useEffect } from 'react';
import GameThumbnail from "./GameThumbnail";
import { BsArrowLeft } from "react-icons/bs";
import '../styles/GameGallery.css';
// import games from '../data/games.json'
import { useContext } from 'react';
import { SortContext } from '../context/SortContext';
import * as Sort from '../helpers/SortGames';
import * as Filter from '../helpers/FilterGames';
import * as Search from '../helpers/SearchGames';
import { FilterContext } from '../context/FilterContext';
import { SearchContext } from '../context/SearchContext';


function GameGallery() {
  
	const [showFullGallery, setShowFullGallery] = useState(false);
	const {sort} = useContext(SortContext)
	const {filter, hasFilter} = useContext(FilterContext)
	const {search, hasSearch} = useContext(SearchContext)
	const [games, setGames] = useState([]);
	
	useEffect(() => {
		async function fetchGameInfo() {
		  try {
			const response = await fetch('http://127.0.0.1:8000/games');
			const data = await response.json();
			setGames(data);
		  } catch (error) {
			console.error('Error fetching game info:', error);
		  }
		}
		fetchGameInfo();
	  }, []);
	  console.log(games);

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

	const filterGames = (games) => {

		if (!hasFilter)
			return games

		const filterString = JSON.stringify(filter).toLowerCase()
		
		if (filterString.includes('players')) {
			return Filter.filterByPlayers(games, filter.players)
		} else if (filterString.includes('genre')) {
			return Filter.filterByGenre(games, filter.genre)
		} else {
			return Filter.filterByYear(games, filter.year)
		}

	}

	const getFilterType = () => {

		const filterString = JSON.stringify(filter).toLowerCase()

		if (filterString.includes('players')) {
			return filter.players
		} else if (filterString.includes('genre')) {
			return filter.genre
		} else {
			return filter.year
		}

	}

	const searchResults = (games) => {

		if (!hasSearch || search=="")
			return games
		return Search.searchBy(games, search)

	}

	return (
		<div className='game-gallery'>
			
			{/* See All || null */}
			{/* {!showFullGallery ?
				<div className="see-all-container" >
					<button className='game-gallery-card see-all-button' onClick={handleSeeAllClick}>
						See All
					</button>	
				</div>
				: null
			} */}

			{/* Game Gallery View */}
			<div className='game-gallery-container'>

				{/* Back Button || null */}
				{showFullGallery ?
					<div className='game-gallery-back-container' onClick={handleSeeAllClick}>
						<button className='back-button-title'>
							<BsArrowLeft className='back-button-icon'/>
							&nbsp; Back
						</button>
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

				{/* Filter Method || null  */}
				{
					hasFilter && !showFullGallery ?
						<div className='game-gallery-sort'>
							<p>Filtering by: {getFilterType()}</p>
						</div>
					: null
				}

				{/* Search Method || null */}
				{
					hasSearch && !showFullGallery ?
						<div className='game-gallery-sort'>
							<p>Results for: "{search}"</p>
						</div>
					: null
				}

				{/* Full Vertical Gallery || Select Horizontal Gallery */}
				<div className={showFullGallery ? 'game-carousel full-gallery' : 'game-carousel'}>
					{showFullGallery
						? searchResults(filterGames(sortGames(games))).map((game) =>
							<GameThumbnail key={game.id} game={game} 
								className='game-gallery-card'
							/>
						)
						: searchResults(filterGames(sortGames(games))).slice(0, 6).map((game) =>
							<GameThumbnail key={game.id} game={game}
								className="game-gallery-card" 
							/>
						)
					}
				</div>

			</div>
		</div>
    );
}

export default GameGallery;