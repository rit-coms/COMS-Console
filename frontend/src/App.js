import './App.css';
import GameGallery from './components/GameGallery';
import GameSearchOverlay from './components/GameSearchOverlay';
import GameSearchOverlay from './components/GameSearchOverlay';
import HomePage from './pages/HomePage'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  const games = [
		{
			name: "QuackAttack",
			author: "Zoe"
		},
		{
			name: "BossDuck",
			author: "Jeff"
		},
		{
			name: "QuackQuackGo",
			author: "Jeff"
		},
		{
			name: "DuckRecker",
			author: "Adrian"
		},
	]
  return (
    <BrowserRouter>
      <h1>QuackBox React Boiler plate code</h1>
      <GameSearchOverlay games={games}></GameSearchOverlay>
      <GameGallery></GameGallery>
    </div>
      
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/search' element={<GameSearchOverlay />} />
      </Routes>
    
      </BrowserRouter>
  );
}

export default App;
