import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { client } from './Client';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element=<client /> ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;