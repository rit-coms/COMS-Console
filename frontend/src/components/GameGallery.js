import React, { useState } from 'react';
import GameThumbnail from "./GameThumbnail";
import '../styles/GameGallery.css';
import { NavLink } from 'react-router-dom';

const allGames = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"];

export default function GameGallery() {
    const [showFullGallery, setShowFullGallery] = useState(false);

    const handleSeeAllClick = () => {
        setShowFullGallery(true);
    };

    return (
        <div className="game-gallery">
            {!showFullGallery && (
                <NavLink to='/see-all' onClick={handleSeeAllClick}>
                    <div className="card" style={{ 'backgroundColor': '#e6e6e6' }}>
                        See All
                    </div>
                </NavLink>
            )}

            {showFullGallery
                ? allGames.map((game) => <GameThumbnail key={game}></GameThumbnail>)
                : games.slice(0, 6).map((game) => <GameThumbnail key={game}></GameThumbnail>)
            }
        </div>
    );
}