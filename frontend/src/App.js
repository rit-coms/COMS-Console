import './App.css';
import GameSearchOverlay from './components/GameSearchOverlay';
import HomePage from './pages/HomePage'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {

	return (
		<div>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<HomePage />} />
					<Route path='/search' element={<GameSearchOverlay />} />
				</Routes>
			</BrowserRouter>
		</div>
		
	);
}

export default App;
