
import { useContext, useEffect, useState } from 'react'
import '../styles/GameThumbnail.css'
import GameInfoModal from './GameInfoModal'
import { PageContext } from '../context/PageContext'

export default function GameThumbnail(props) {
	
	const [showDetails, setShowDetails] = useState(false)
	const { changePage } = useContext(PageContext)

	useEffect(() => {
		if (showDetails) {
			changePage('game info modal')
		}

	}, [showDetails])

	return (
		<div className={props.className} onClick={() => setShowDetails(!showDetails)}>
			<GameInfoModal isOpen={showDetails} toggleModal={() => setShowDetails(false)} game={props.game} />
			{
				(props.game.image.indexOf('placeholder') < 0) ?
					<div className='game-thumbnail' style={{ backgroundImage: `url(${props.game.image})` }}>
						<h3>{props.game.title}</h3>
					</div>
				:
					<div className='game-thumbnail'>
						<h3>{props.game.title}</h3>
					</div>
			}
		</div>
	)
}