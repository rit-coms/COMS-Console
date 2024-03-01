import './App.css';
import GameGallery from './components/GameGallery';
import GameSearchOverlay from './components/GameSearchOverlay';

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
    <div>
      <h1>QuackBox React Boiler plate code</h1>
      <GameSearchOverlay games={games}></GameSearchOverlay>
      <GameGallery></GameGallery>
    </div>
  );
}

export default App;
