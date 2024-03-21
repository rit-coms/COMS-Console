import GameGallery from "../components/GameGallery"
import { BsSliders2 } from "react-icons/bs";
import { BsSortDown } from "react-icons/bs";
import { BsTriangle } from "react-icons/bs";
import '../styles/HomePage.css'

export default function HomePage() {

	const search = () => {
		console.log("search")
	}

	const filter = () => {
		console.log("filter")
	}

	const sort = () => {
		console.log("sort")
	}

	return (
		<div>
			{/* Navigation Bar */}
			<nav className="navigation-bar">
				{/* Search Bar */}
				<div className="search-bar">
					<div className="search-title" onClick={search}>
						Search
						<BsTriangle className="search-icon no-fill-triangle" />
					</div>
				</div>
				{/* Filter and Sort Buttons */}
				<div className="search-query-buttons">
					<BsSliders2 className="search-filter-button" onClick={filter} />
					<BsSortDown className="search-sort-button" onClick={sort}/>
				</div>
			</nav>

			<GameGallery />

		</div>
		
	)
}