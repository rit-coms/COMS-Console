import React, { useState } from 'react';
import GameThumbnail from "./GameThumbnail";
import '../styles/GameGallery.css';

const allGames = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"];

export default function GameGallery() {
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
				? allGames.map((game) => <div className="card" style={{ 'backgroundColor': '#e6e6e6' }}><GameThumbnail key={game}></GameThumbnail></div>)
				: allGames.slice(0, 6).map((game) => <div className="card" style={{ 'backgroundColor': '#e6e6e6' }}><GameThumbnail key={game}></GameThumbnail></div>)
			}
            
        </div>
    );
}