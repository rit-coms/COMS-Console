import { useContext, useEffect } from "react";
import Bubble from "../components/Bubble";
import GameGallery from "../components/GameGallery"
import Navigation from "../components/Navigation";
import { FilterProvider } from "../context/FilterContext";
import { SearchProvider } from "../context/SearchContext";
import { SortProvider } from "../context/SortContext";
import { ControllerContext } from "../context/ControllerContext";
import ControllerConnectPage from "./ControllerConnectPage";
import { PageContext } from "../context/PageContext";

export default function HomePage() {

	const {isConnected, players, currentButton} = useContext(ControllerContext)
	const _players = Object.values(players['current']).slice(2, 4)

	const {
		modifyHierarchyIndex, modifyElementIndex, pageHierarchy,
		pageIndex, focusElement, clickElement, clearClasslist
	} = useContext(PageContext)


	useEffect(() => {
		console.log(pageHierarchy)
		console.log("PAGEINDEX: ", pageIndex)
	})

	useEffect(() => {

		if (_players.filter((player) => player != null).length > 0) {

			clearClasslist()
			focusElement()

			switch (currentButton) {
				case "DOWN":
					modifyHierarchyIndex('increase')
					break
				case "UP":
					modifyHierarchyIndex('decrease')
					break
				case "RIGHT":
					modifyElementIndex('increase')
					break
				case "LEFT":
					modifyElementIndex('decrease')
					break
				case "A":
					clickElement()
					break
			}

		}

	}, [currentButton])


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