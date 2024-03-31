import { useContext } from "react";
import Bubble from "../components/Bubble";
import GameGallery from "../components/GameGallery"
import Navigation from "../components/Navigation";
import { FilterProvider } from "../context/FilterContext";
import { SearchProvider } from "../context/SearchContext";
import { SortProvider } from "../context/SortContext";
import { ControllerContext } from "../context/ControllerContext";
import ControllerConnectPage from "./ControllerConnectPage";

export default function HomePage() {

	const {isConnected} = useContext(ControllerContext)

	return (
		<> {
			isConnected ?
				<SearchProvider>
					<SortProvider>
						<FilterProvider>
							<Bubble />
							<Navigation />
							<GameGallery />
						</FilterProvider>
					</SortProvider>
				</SearchProvider>
				: <ControllerConnectPage />
		}
		</>
	)
}