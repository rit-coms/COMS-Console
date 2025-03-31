import React from "react";
import { Modal, Pill, Text } from "quackbox-design-system";
import "../styles/GameInfoModal.css";

export default function GameInfoModal({ showModal, closeModal, game}) {

	// TODO: reimplement for tauri
	// const playGame = () => {
		
	// 	fetch("http://127.0.0.1:8000/launch?id=" + game.id)
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
	// const playGame = async id => {
	// 	invoke("play_game", {id: game.id})
	// }

	if (!showModal)
        return null;

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

	const handlePlayGame = () => {
		if (!isPlaceholder)
			console.log("play game: ", game.exec);
		closeModal();
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
			<div className="game-description">

				<Text weight="bold" fontSize={"xlarge"}>{game.title}</Text>
				<Text fontSize={"medium"}>{!isPlaceholder ? `Created By ${game.author}` : game.author}</Text>
				{game.release_date && <Text>{formatDate(game.release_date)}</Text>}

				<br />

				{game.genres && 
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
				}
				
				<br />

				{game.summary &&
					<Text>
						{game.summary.length > 250 ? 
							game.summary.slice(0, 250) + "..." 
							: game.summary
						}
					</Text>
				}
			</div>

		</Modal>
    );
};
