import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Client from './Client';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Client />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;