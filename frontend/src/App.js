
import { ControllerProvider } from './context/ControllerContext';
import HomePage from './pages/HomePage'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {

	return (
		<div>
			<BrowserRouter>
				<ControllerProvider>
					<Routes>
						<Route path='/' element={<HomePage />} />
					</Routes>
				</ControllerProvider>
			</BrowserRouter>
		</div>

	);
}

export default App;
