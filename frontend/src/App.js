import './App.css';
import GameSearchOverlay from './components/GameSearchOverlay';
import HomePage from './pages/HomePage'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <h1>QuackBox React Boiler plate code</h1>
      
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/search' element={<GameSearchOverlay />} />
      </Routes>
    
      </BrowserRouter>
  );
}

export default App;
