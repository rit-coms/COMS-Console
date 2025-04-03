import React, { useEffect } from "react";
import { useGamepadContext, usePageContext } from "../context/contexts";
import { NavigationProvider } from "../context/NavigationContext";
import Navigation from "../components/Navigation";
import GameGallery from "../components/GameGallery";
import Footer from "../components/Footer";
import ControllerConnectPage from "./ControllerConnectPage";
import "../styles/HomePage.css";

export default function HomePage() {

	const { allPlayersConnected } = useGamepadContext();
	const { updatePage } = usePageContext();

	useEffect(() => {

		allPlayersConnected && (
			setTimeout(() => { 
				updatePage("home page");
			}, 0)
		);
        
    }, [allPlayersConnected]);

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
