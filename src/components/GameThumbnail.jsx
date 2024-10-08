
import { useContext, useEffect, useState } from 'react'

import '../styles/GameThumbnail.css'
import GameInfoModal from './GameInfoModal'
import { PageContext } from '../context/PageContext'

export default function GameThumbnail(props) {
	
	const [showDetails, setShowDetails] = useState(false)
	const { changePage } = useContext(PageContext)
	let game = props.game

	useEffect(() => {
		if (showDetails) {
			changePage('game info modal')
		}

	}, [showDetails])
  
	const [gameInfo, setGameInfo] = useState(null)

	useEffect(() => {
		async function fetchGameInfo() {
		  try {
			const response = await fetch('http://127.0.0.1:8000/game?id=' + game.id);
			const data = await response.json();
			setGameInfo(data);
		  } catch (error) {
			console.error('Error fetching game info:', error);
		  }
		}
	
		if (showDetails && !gameInfo) {
		  fetchGameInfo();
		}
	  }, [showDetails, game.id, gameInfo]);

	return (
		<div className={props.className} onClick={() => setShowDetails(!showDetails)}>
			<GameInfoModal isOpen={showDetails} toggleModal={() => setShowDetails(false)} game={game} gameInfo={gameInfo} />
			{
				(game.cover_image.indexOf('placeholder') < 0 && game.cover_image.indexOf('.jpg') > 0) ?
					<div className='game-thumbnail' style={{ backgroundImage: `url(${game.cover_image})` }}
						onClick={() => setShowDetails(!showDetails)}
					>
						<h3>{game.title}</h3>
					</div>
				:
					<div className='game-thumbnail'>
						<h3>{props.game.title}</h3>
					</div>
			}
		</div>
	)
}