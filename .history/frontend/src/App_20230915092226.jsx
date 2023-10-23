//import { Route, Routes } from 'react-router-dom'
import './App.css'
import Container from './components/views/Container';

import Content from './layout/Content/Content'
import Sidebar from './layout/Sidebar/Sidebar'
import { BrowserRouter, Route, Routes, } from 'react-router-dom';


function App() {

  return (
    <BrowserRouter >
      <div className='app'>
      <Sidebar/>
      <Routes>
        <Route path="/Content" element={<Content />} />
        <Route path="/container" element={<Container />} />
      </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
