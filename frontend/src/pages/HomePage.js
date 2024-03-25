import GameGallery from "../components/GameGallery"
import Navigation from "../components/Navigation";
import { FilterProvider } from "../context/FilterContext";
import { SortProvider } from "../context/SortContext";

export default function HomePage() {

	return (
		<>
			<SortProvider>
				<FilterProvider>
					<Navigation />
					<GameGallery />
				</FilterProvider>
			</SortProvider>
		</>
	)
}