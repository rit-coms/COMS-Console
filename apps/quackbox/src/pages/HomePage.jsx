import React, { useEffect } from "react";
import { useGamepadContext, usePageContext, useToastContext } from "../context/contexts";
import { NavigationProvider } from "../context/NavigationContext";
import Navigation from "../components/Navigation";
import GameGallery from "../components/GameGallery";
import Footer from "../components/Footer";
import ControllerConnectPage from "./ControllerConnectPage";
import "../styles/HomePage.css";

export default function HomePage() {

	const { players, allPlayersConnected, setAllPlayersConnected } = useGamepadContext();
	const { updatePage } = usePageContext();
	const { showToast } = useToastContext();

	useEffect(() => {

		allPlayersConnected && (
			setTimeout(() => { 
				updatePage("home page");
			}, 10)
		);
        
    }, [allPlayersConnected]);

	useEffect(() => {

		if (allPlayersConnected && players.length == 0) {
			console.log(players)
			showToast("All Players disconnected, rerouting...", "danger")
			setTimeout(() => {
				updatePage("controller connect");
			}, 0)
			setTimeout(() => {
				setAllPlayersConnected(false);
			}, 1500)
		}

	}, [players.length])

	return (
		allPlayersConnected || (import.meta.env.DEV) ? // disables controller connect when running in dev mode
			<NavigationProvider>
				<div className="home-page">
					<Navigation />
					<GameGallery />
					<Footer />
				</div>
			</NavigationProvider>
		: <ControllerConnectPage />
		
	);
}
