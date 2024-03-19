import GameThumbnail from "./GameThumbnail";
import '../styles/GameGallery.css'
import {NavLink} from 'react-router-dom'


export default function GameGallery() {

	// TODO: Make API call to get games
	let games = [
		{
			"id": "duck-duck-go",
			"title": "duck duck go",
			"image": "./assets/placeholder.jpg"
		},
		{
			"id": "go-duck",
			"title": "go duck",
			"image": "./assets/placeholder.jpg"
		},
		{
			"id": "snake-but-ducks",
			"title": "Snake! but ducks",
			"image": "./assets/placeholder.jpg"
		}
	]

	
	
	return (
		<div className="game-gallery">
			
			<div className="card" style={{'backgroundColor':'#e6e6e6'}}>
				See All
			</div>
			
			
			{/* For every game, add thumbnail */}
			{
				games.map(game => (
					<GameThumbnail key={game.id}></GameThumbnail>
				))
			}
			
		</div>
	)
}