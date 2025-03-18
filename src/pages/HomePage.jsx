import { useContext, useEffect } from "react";
import Bubble from "../components/Bubble";
// import GameGallery from "../components/GameGallery"
import Navigation from "../components/Navigation";
import { FilterProvider } from "../context/FilterContext";
import { SearchProvider } from "../context/SearchContext";
import { SortProvider } from "../context/SortContext";
import { ControllerContext } from "../context/ControllerContext";
import ControllerConnectPage from "./ControllerConnectPage";
import { PageContext } from "../context/PageContext";
import Footer from "../components/Footer";
import "../styles/HomePage.css"
import { useGamepadContext } from "../context/GamepadContext";

export default function HomePage() {

	const { allPlayersConnected } = useGamepadContext()

	return (
		<> {
			allPlayersConnected ?
				<SearchProvider>
					<SortProvider>
						<FilterProvider>
							<div className="home-page">
								{/* <Bubble /> */}
								<Navigation />
								{/* <GameGallery /> */}
								<Footer />
							</div>
						</FilterProvider>
					</SortProvider>
				</SearchProvider>
				: <ControllerConnectPage />
		}
		</>
	)
}