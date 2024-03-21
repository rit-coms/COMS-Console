import GameGallery from "../components/GameGallery"
import { BsSliders2 } from "react-icons/bs";
import { BsSortDown } from "react-icons/bs";
import { BsTriangle } from "react-icons/bs";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import React, { useState } from 'react';
import GameSearchOverlay from '../components/GameSearchOverlay';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navigation from "../components/Navigation";

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

	

	return (
		<div>
			
			<Navigation />
			<GameGallery />

		</div>
		
	)
}