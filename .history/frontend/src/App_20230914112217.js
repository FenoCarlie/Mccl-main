import { BrowserRouter, Routes } from 'react-router-dom';
import './App.css';
import Client from './Client';


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
