import React from 'react'
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Navbar from './components/Navbar.jsx';
import Prospects from './pages/Prospects.jsx';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const App = () => {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/prospects" element={<Prospects />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App