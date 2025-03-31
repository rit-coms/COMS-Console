import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GamepadProvider } from "./context/GamepadContext";
import { PageProvider } from "./context/PageContext";
import { ToastManager, ToastProvider } from "./context/ToastContext";
import HomePage from "./pages/HomePage";

export default function App() {
	return (
		<div>
			<BrowserRouter>
				<GamepadProvider>
					<PageProvider>
						<ToastProvider>
							<Routes>
								<Route path="/" element={<HomePage />} />
							</Routes>
							<ToastManager />
						</ToastProvider>
					</PageProvider>
				</GamepadProvider>
			</BrowserRouter>
		</div>

	);
}
