import { useState } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import GameModal from './GameInfoCard';

function GameSearchOverlay ({games}) {
	let [search, setSearch] = useState("")
	let [searchResults, setSearchResults] = useState([]);

	const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGame, setSelectedGame] = useState(null);

	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
	};

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

	const openModal = (game) => {
        setSelectedGame(game);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedGame(null);
        setIsModalOpen(false);
    };
	
	return (
		<div>
			<Slider {...settings}>
				{searchResults.map((game, index) => (
					<div key={index} style={{textAlign: 'center', margin: 'auto', width: '50%' }}>
						<img height="120px" width="120px" 
						style={{ display: 'block', margin: 'auto' }}
						src='https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2F7%2F74%2FWhite_domesticated_duck%2C_stretching.jpg&f=1&nofb=1&ipt=fe16a3ffa3dbfffac1161692adff97ed1ec76957bdad784cfdb37813d1a8a561&ipo=images'></img>
						<h3 style={{textAlign: 'center', margin: 'auto', width: '50%' }}
						onClick={() => openModal(game)}>{game.name}</h3>
						<p style={{textAlign: 'center', margin: 'auto', width: '50%' }}>{game.author}</p>
					</div>
				))}
			</Slider>
			<GameModal isOpen={isModalOpen} onRequestClose={closeModal} game={selectedGame} />

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