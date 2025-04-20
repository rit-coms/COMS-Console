import React, { useState } from "react";
import { Link, Modal, Pill, Tab, Table, TableData, TableRow, Tabs, Text } from "quackbox-design-system";
import "../styles/GameInfoModal.css";
import { invoke } from "@tauri-apps/api/tauri";
import { usePageContext } from "../context/contexts";

export default function GameInfoModal({ showModal, closeModal, game}) {

	if (!showModal)
        return null;

	const { updatePage } = usePageContext();
	const [leaderboard, setLeaderboard] = useState([])
	const isPlaceholder = game.title.toLowerCase().includes("coming soon");
	const hasCoverImage = !game.coverImage?.includes("null");

	const formatDate = (dateString) => {
		// yyyy-mm-dd date format
		const dateParts = dateString.split("-");
		const formattedDateString = `${dateParts[0]}-${String(dateParts[1]).padStart(2, "0")}-${String(dateParts[2]).padStart(2, "0")}`;
		
		const date = new Date(formattedDateString);
		const options = { year: "numeric", month: "long", day: "numeric" };
		return date.toLocaleDateString("en-US", options);
	};

	// useEffect(() => {
	// 	invoke("").then(leaderboard => {
	// 		leaderboard = leaderboard.map(async gameInfo => {
    //             return leaderboard;
	// 		});
	// 		console.log(leaderboard);
	// 		Promise.all(leaderboard).then(leaderboard => setLeaderboard(leaderboard));
	// 	},
    //     (err) => {
    //         console.error(err)
    //     }
    // );
	// }, []);

	const getTopFiveLeaderboard = () => {
		return [...leaderboard]
			.sort((a, b) => b.points - a.points)
			.slice(0, 5);
	};

	const startGame = async (gameId) => {
		try {
			await invoke("play_game", { id: gameId });
			console.log(`Started Game ${game.title}`);
		} catch (error) {
			console.error(error);
		}
	};

	const handlePlayGame = () => {
		if (!isPlaceholder)
			startGame(game.id);

		closeModal();
		setTimeout(() => {
			updatePage("home page");
		}, 0);
	};
	
	return (
		<Modal
			isOpen={showModal}
			onClose={closeModal}
			variant={"gameInfo"}
			overlay
			confirmLabel={!isPlaceholder ? "Play" : "Close"}
			confirmLabelColorPrimary
			title={game.title}
			gameImageSrc={hasCoverImage ? game.coverImage : "src/assets/placeholder.png"}
			onConfirmation={handlePlayGame}
			dataId="game-info"
		>
			<div className="game-info">

				<div className="game-author">
					<Text fontSize={"medium"}>{!isPlaceholder ? `Created by ${game.author}` : game.author}</Text>
					{game.release_date && <Text fontSize="small">{formatDate(game.release_date)}</Text>}
				</div>

				<Tabs dataId="game-tabs">
					<Tab label={!isPlaceholder ? "Game Details" : "Details"}>
						<div className="game-details">
							<div className="game-description">
								<Text fontSize="small">Description</Text>
								<Text>
									{game.summary.length > 250 ?
										game.summary.slice(0, 250) + "..."
										: game.summary
									}
								</Text>
							</div>
							<div className="game-genres">
								
								{game.genres && 
									<>
										<Text fontSize="small">Tags</Text>
										<div className="game-tags">
											
											{game.multiplayer !== null && (
												game.multiplayer === 'Multiplayer' &&
													<Pill>Multiplayer</Pill>
													|| <Pill>Single Player</Pill>
											)}

											{game.genres.map((genre, index) => {
												return (
													<Pill
														key={index}
														variant="secondary"
													>
														{genre}
													</Pill>
												);
											})}
										</div>
									</>
								}
							</div>
						</div>
					</Tab>
					{!isPlaceholder && 
						<Tab label="Leaderboard">
							{leaderboard.length != 0 ?
								<div className="game-leaderboard">
									<Table headers={["Date", "Player", "Points"]}>
										{getTopFiveLeaderboard().map((data, index) => (
											<TableRow>
												<TableData>{data.date}</TableData>
												<TableData>{data.player}</TableData>
												<TableData>{data.points}</TableData>
												</TableRow>
										))}
									</Table>
								</div>
								:
								<div className="game-leaderboard">
									No leaderboard data to show
								</div>
							}
						</Tab>
					}
				</Tabs>
			</div>

		</Modal>
    );
};
