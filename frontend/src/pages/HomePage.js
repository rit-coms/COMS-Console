import GameGallery from "../components/GameGallery"
import Navigation from "../components/Navigation";
import { SortProvider } from "../context/SortContext";

export default function HomePage() {

	return (
		<>
			<SortProvider>
				<Navigation />
				<GameGallery />
			</SortProvider>
		</>
	)
}