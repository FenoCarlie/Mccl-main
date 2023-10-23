import { BrowserRouter, Routes } from 'react-router-dom';
import './App.css';
import client from './client';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Routes
            path='/'
            element={<Client />}
            >

          </Routes>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
