
import '../styles/GameThumbnail.css'

export default function GameThumbnail({game}) {
	
	return (
		<div className='game-thumbnail' onClick={() => console.log(game.title)}>
			<h3>{game.title}</h3>
		</div>
	)
}