
import GameGallery from "../components/GameGallery"
import { BiFilter } from "react-icons/bi"
import { BiSortAlt2 } from "react-icons/bi"
import { BiSolidRightArrow } from "react-icons/bi"
import { NavLink } from 'react-router-dom'
import { useContext } from "react"

const filter = () => {
	console.log("filter")
}

const sort = () => {
	console.log("sort")
}

export default function HomePage() {


	return (
		<div>
			{/* Search */}
			<div style={{ display: 'inline' }}> 
				<form autoComplete="off" style={{ display: 'inline' }}>
					<input type="text" placeholder="Search" name="search"/>
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