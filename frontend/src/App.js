import './App.css';
import HomePage from './pages/HomePage'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <h1>QuackBox React Boiler plate code</h1>
      
      <Routes>
        <Route path='/' element={<HomePage />} />
      </Routes>
    
      </BrowserRouter>
  );
}

export default App;
