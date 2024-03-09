import GameThumbnail from "./GameThumbnail";
import '../styles/GameGallery.css'
import {NavLink} from 'react-router-dom'

const games = ["1", "2", "3", "4", "5", "6", "7", "8"]

export default function GameGallery() {
	
	return (
		<div className="game-gallery">
			
			<NavLink to='/see-all'>
				<div className="card" style={{'backgroundColor':'#e6e6e6'}}>
					See All
				</div>
			</NavLink>
			
			{/* For every game, add thumbnail */}
			{
				games.map(game => (
					<GameThumbnail key={game}></GameThumbnail>
				))
			}
			
		</div>
	)
}