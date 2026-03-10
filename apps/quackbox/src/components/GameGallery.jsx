import React, { useEffect, useState } from "react";
import { useModal } from "../hooks/useModal"; 
import { useNavigationContext, usePageContext } from "../context/contexts";
import GameInfoModal from "./GameInfoModal";
import { Carousel, Header, Text } from "quackbox-design-system";
import { convertFileSrc, invoke } from "@tauri-apps/api/core";
import "../styles/GameGallery.css";

export default function GameGallery() {
  
    const [showGameInfoModal, openGameInfoModal, closeGameInfoModal] = useModal();
    const { updatePage } = usePageContext();
    const { savedSearchValue, sortOption } = useNavigationContext();
    const [currentGame, setCurrentGame] = useState({});
    const [games, setGames] = useState([]);

    const featuredGamesLimit = 3;

    useEffect(() => {
		invoke("get_game_info").then(games => {
			games = games.map(async gameInfo => {
				gameInfo.cover_image = await convertFileSrc(gameInfo.cover_image);
                gameInfo.coverImage = gameInfo.cover_image;
                return gameInfo;
			});
			console.log(games);
			Promise.all(games).then(games => setGames(games));
		},
        (err) => {
            console.error(err)
        }
    );
	}, []);

    const getModifiedGamesList = () => {

        // Filter games and relegate any placeholders to the back
        let newGames = games;

        if (savedSearchValue !== "") {
            newGames = [...games.filter((game) => game.title.toLowerCase().includes(savedSearchValue.toLowerCase()))];
        } else if (sortOption === "alphabetical") {
            newGames = [
                ...games.filter(game => game.title.toLowerCase() !== "coming soon")
                  .sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase())),
                ...games.filter(game => game.title.toLowerCase() === "coming soon")
            ];
        } else if (sortOption === "reverse alphabetical") {
            newGames = [
                ...games.filter(game => game.title.toLowerCase() !== "coming soon")
                  .sort((a, b) => b.title.toLowerCase().localeCompare(a.title.toLowerCase())),
                ...games.filter(game => game.title.toLowerCase() === "coming soon")
            ];
        }

        return newGames;
    };

    const handleGameClick = (game) => {
        setCurrentGame(game);
        
        setTimeout(() => {
            updatePage("game info modal");
        }, 0);
        openGameInfoModal();
    };

    const handleCloseGameInfoModal = () => {
        closeGameInfoModal();
        setTimeout(() => {
            updatePage("home page");
        }, 0);
    };

	return (
        <>
            <GameInfoModal showModal={showGameInfoModal} closeModal={handleCloseGameInfoModal} game={currentGame} />
            <div className="game-gallery-container">
                <div className="game-gallery-header">
                    <Header level={1} fontSize={"xlarge"}>{ savedSearchValue !== "" ? `Searching for: ${savedSearchValue}` : "Explore the Collection"}</Header>
                    { sortOption === "alphabetical" ?
                        <Text>Sorting Alphabetically</Text>
                        : sortOption !== "none" && (
                            <Text>Sorting Reverse Alphabetically</Text>
                        )
                    }
                </div>
                <div className="game-gallery">
                    <Carousel featuredGameLimit={featuredGamesLimit} dataId="carousel" games={getModifiedGamesList()} onGameClick={handleGameClick}/>
                </div>
            </div>
        </>
	);
}
