
import { ControllerProvider } from './context/ControllerContext';
import { PageProvider } from './context/PageContext';
import HomePage from './pages/HomePage'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {

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
