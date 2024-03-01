import { useState } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import Carousel from 'react-bootstrap/Carousel';

function GameSearchOverlay ({games}) {
	let [search, setSearch] = useState("")
	let [searchResults, setSearchResults] = useState([]);

	const onChange = (input) => {
		search = setSearch(input);
		console.log("Search changed", search);
	  }
	
	const onKeyPress = (button) => {
		console.log("Button pressed", button);
		// When enter is clicked, search for the game
		if (button == "{enter}") {
			console.log("ENTER")
			searchGame(search);
		}
	}

	const searchGame = (searchTerm) => {
		let searchResults = []
		games.forEach(game => {
			// Add the game to an array of search results if the search term is included in the name or author
			if (game.name.toLowerCase().includes(searchTerm) || game.author.toLowerCase().includes(searchTerm)) {
				searchResults.push(game);
			}
		});

		console.log(searchResults);
		setSearchResults(searchResults);

		return searchResults;
	}
	
	return (
		<div>

			<h1 style={{
				"border-radius": "15px", 
				"width": "100%",
				"background-color": "#f2f2f2",
				"textAlign": "center"
			}}>{search ? search : "Enter in a game or author..."}</h1>
			<Keyboard
				onChange={onChange}
				onKeyPress={onKeyPress}
			/>
		</div>
	)
}

export default GameSearchOverlay;