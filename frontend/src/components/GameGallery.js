import React, { useState } from 'react';
import GameThumbnail from "./GameThumbnail";
import '../styles/GameGallery.css';

export default function GameGallery() {

	// TODO: Make API call to get games
	let games = [
		{
			"id": "duck-duck-go",
			"title": "duck duck go",
			"image": "./assets/placeholder.jpg"
		},
		{
			"id": "go-duck",
			"title": "go duck",
			"image": "./assets/placeholder.jpg"
		},
		{
			"id": "snake-but-ducks",
			"title": "Snake! but ducks",
			"image": "./assets/placeholder.jpg"
		},
		{
			"id": "duck-duck-go6",
			"title": "duck duck go",
			"image": "./assets/placeholder.jpg"
		},
		{
			"id": "go-duck4",
			"title": "go duck",
			"image": "./assets/placeholder.jpg"
		},
		{
			"id": "snake-but-ducks9",
			"title": "Snake! but ducks",
			"image": "./assets/placeholder.jpg"
		},
		{
			"id": "duck-duck-go1",
			"title": "duck duck go",
			"image": "./assets/placeholder.jpg"
		},
		{
			"id": "go-duck2",
			"title": "go duck",
			"image": "./assets/placeholder.jpg"
		},
		{
			"id": "snake-but-ducks3",
			"title": "Snake! but ducks",
			"image": "./assets/placeholder.jpg"
		},
		{
			"id": "duck-duck-go11",
			"title": "duck duck go",
			"image": "./assets/placeholder.jpg"
		},
		{
			"id": "go-duck21",
			"title": "go duck",
			"image": "./assets/placeholder.jpg"
		},
		{
			"id": "snake-but-ducks31",
			"title": "Snake! but ducks",
			"image": "./assets/placeholder.jpg"
		}
	]
  
	const [showFullGallery, setShowFullGallery] = useState(false);

    const handleSeeAllClick = () => {
        setShowFullGallery(!showFullGallery);
    };
	
	return (
        <div className={showFullGallery ? 'game-gallery wrap' : 'game-gallery'}>
            <div className="card" style={{ 'backgroundColor': '#e6e6e6' }}>
                <button onClick={handleSeeAllClick}>
                    {showFullGallery ? 'Show Less' : 'See All'}
                </button>
            </div>

			{showFullGallery
				? games.map((game) => 
					<div className="card" style={{ 'backgroundColor': '#e6e6e6' }}>
						<GameThumbnail key={game}></GameThumbnail>
					</div>
				)
				// TODO reserve for previous 6 games played
				: games.slice(0, 6).map((game) => 
					<div className="card" style={{ 'backgroundColor': '#e6e6e6' }}>
						<GameThumbnail key={game}></GameThumbnail>
					</div>
				)
			}
        </div>
    );
}