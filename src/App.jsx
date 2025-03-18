import { GamepadProvider } from './context/GamepadContext';
import { PageProvider } from './context/PageContext';
import HomePage from './pages/HomePage'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
	return (
		<div>
			<BrowserRouter>
				<GamepadProvider>
					<PageProvider>
						<Routes>
							<Route path='/' element={<HomePage />} />
						</Routes>
					</PageProvider>
				</GamepadProvider>
			</BrowserRouter>
		</div>

	);
}

export default App;
