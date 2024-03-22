
import { useState } from 'react'
import '../styles/GameThumbnail.css'
import GameInfoModal from './GameInfoModal'

export default function GameThumbnail({game}) {
	
	const [showDetails, setShowDetails] = useState(false)

	return (
		<>
			<GameInfoModal isOpen={showDetails} toggleModal={() => setShowDetails(false)} game={game} />
			<div className='game-thumbnail' onClick={() => setShowDetails(!showDetails)}>
				<h3>{game.title}</h3>
			</div>
		</>
	)
}