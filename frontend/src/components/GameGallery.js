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
		}
	]
  
  const [showFullGallery, setShowFullGallery] = useState(false);

    const handleSeeAllClick = () => {
        setShowFullGallery(!showFullGallery);
    };

	
	
	return (
        <div className="game-gallery">
            <div className="card" style={{ 'backgroundColor': '#e6e6e6' }}>
                <button onClick={handleSeeAllClick}>
                    {showFullGallery ? 'Show Less' : 'See All'}
                </button>
            </div>

			{showFullGallery
				? games.map((game) => <div className="card" style={{ 'backgroundColor': '#e6e6e6' }}><GameThumbnail key={game}></GameThumbnail></div>)
				: games.slice(0, 6).map((game) => <div className="card" style={{ 'backgroundColor': '#e6e6e6' }}><GameThumbnail key={game}></GameThumbnail></div>)
			}
            
        </div>
    );
}