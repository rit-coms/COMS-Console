
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

	return (
		<div className={props.className} onClick={() => setShowDetails(!showDetails)}>
			<GameInfoModal isOpen={showDetails} toggleModal={() => setShowDetails(false)} game={game} />
			{
				game.cover_image ?
					<div className='game-thumbnail' style={{ backgroundImage: `url(${game.cover_image})` }}
						onClick={() => setShowDetails(!showDetails)}
					>
						<h3>{game.title}</h3>
					</div>
				:
					<div className='game-thumbnail'>
						<h3>{game.title}</h3>
					</div>
			}
		</div>
	)
}