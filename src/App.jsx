
import { useEffect } from 'react';
import { ControllerProvider } from './context/ControllerContext';
import { PageProvider } from './context/PageContext';
import HomePage from './pages/HomePage'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { appWindow } from "@tauri-apps/api/window";

function App() {
	useEffect(async () => {
		await appWindow.show();
	}, [])
	return (
		<div>
			<BrowserRouter>
				<ControllerProvider>
					<PageProvider>
						<Routes>
							<Route path='/' element={<HomePage />} />
						</Routes>
					</PageProvider>
				</ControllerProvider>
			</BrowserRouter>
		</div>

	);
}

export default App;
