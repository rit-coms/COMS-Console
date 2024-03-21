import GameGallery from "../components/GameGallery"
import { BsSliders2 } from "react-icons/bs";
import { BsSortDown } from "react-icons/bs";
import { BsTriangle } from "react-icons/bs";
import '../styles/HomePage.css'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import React, { useState } from 'react';
import GameSearchOverlay from '../components/GameSearchOverlay';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function HomePage() {
  
	const [modal, setModal] = useState(false);
	const toggle = () => setModal(!modal);
  
	const search = () => {
		console.log("search")
    	toggle();
	}
  
	const filter = () => {
		console.log("filter")
	}

	const sort = () => {
		console.log("sort")
	}

	const games = [
		{
			name: "QuackAttack",
			author: "Zoe"
		},
		{
			name: "BossDuck",
			author: "Jeff"
		},
		{
			name: "QuackQuackGo",
			author: "Jeff"
		},
		{
			name: "DuckRecker",
			author: "Adrian"
		},
	];

	return (
		<div>

			<Modal 
				isOpen={modal} 
				toggle={toggle} 
				className="modal-fullscreen"
			>
				<ModalBody>
					<GameSearchOverlay games={games}></GameSearchOverlay>
				</ModalBody>
				<ModalFooter>
				<Button color="primary" onClick={search}>
					Search
				</Button>{' '}
				<Button color="secondary" onClick={toggle}>
					Cancel
				</Button>
				</ModalFooter>
			</Modal>
			
			{/* Navigation Bar */}
			<nav className="navigation-bar">
				{/* Search Bar */}
				<div className="mascot"></div>
				<div className="navigation-container">

					
					<div className="search-bar">
						<div className="search-title" onClick={search}>
							Search
						</div>
						<BsTriangle className="search-icon no-fill-triangle" />
					</div>
					{/* Filter and Sort Buttons */}
					<div className="search-query-buttons">
						<BsSliders2 className="search-filter-button" onClick={filter} />
						<BsSortDown className="search-sort-button" onClick={sort}/>
					</div>
				</div>
			</nav>

			<GameGallery />

		</div>
		
	)
}