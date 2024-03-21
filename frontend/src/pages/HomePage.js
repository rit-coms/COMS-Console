import GameGallery from "../components/GameGallery"
import { BiFilter } from "react-icons/bi"
import { BiSortAlt2 } from "react-icons/bi"
import { BiSolidRightArrow } from "react-icons/bi"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import React, { useState } from 'react';
import GameSearchOverlay from '../components/GameSearchOverlay';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


const filter = () => {
	console.log("filter")
}

const sort = () => {
	console.log("sort")
}

export default function HomePage() {
	const [modal, setModal] = useState(false);

  	const toggle = () => setModal(!modal);

	const search = () => {
		toggle();
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
			

			<div style={{ display: 'inline' }}> 
				<form autoComplete="off" style={{ display: 'inline' }}>
					<input type="text" placeholder="Search" name="search" onClick={toggle}/>
				</form>
			</div>

			{/* Buttons: Right, Filter, Sort */}
			<div style={{display:'inline'}}>
				<button type="submit"><BiSolidRightArrow style={{ fontSize: '12px' }} /></button>
				<BiFilter style={{ padding: '0px 10px', backgroundColor: '#e6e6e6', border: '1px solid' }} type="submit" onClick={filter} />
				<BiSortAlt2 style={{ padding: '0px 10px', backgroundColor: '#e6e6e6', border: '1px solid' }} type="submit" onClick={sort} />
			</div>

			<GameGallery />

		</div>
		
	)
}