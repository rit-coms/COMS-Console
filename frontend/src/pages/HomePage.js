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

	const {isConnected} = useContext(ControllerContext)

	const {
		changePage, modifyHierarchyIndex, modifyElementIndex,
		pageIndex, focusElement, clickElement, clearClasslist, resetPageIndex
	} = useContext(PageContext)


	useEffect(() => {
		console.log("HOMEEE")
	}, [])


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