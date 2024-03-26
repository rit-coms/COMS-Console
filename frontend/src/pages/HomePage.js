import Bubble from "../components/Bubble";
import GameGallery from "../components/GameGallery"
import Navigation from "../components/Navigation";
import { FilterProvider } from "../context/FilterContext";
import { SearchProvider } from "../context/SearchContext";
import { SortProvider } from "../context/SortContext";

export default function HomePage() {

	return (
		<>
			<SearchProvider>
				<SortProvider>
					<FilterProvider>
						<Bubble />
						<Navigation />
						<GameGallery />
					</FilterProvider>
				</SortProvider>
			</SearchProvider>
		</>
	)
}