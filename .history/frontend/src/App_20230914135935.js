import './App.css';
import React from 'react';
import Sidebar from './components/Sidebar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Container from './components/views/Container';
import Home from './components/views/Home';
import Client from './components/views/Client';

function App() {
  return (
    <BrowserRouter>
      <Sidebar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/container" element={<Container />} />
        <Route path="/client" element={<Client />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;