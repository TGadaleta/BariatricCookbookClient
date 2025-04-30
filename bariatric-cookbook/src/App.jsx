import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/Auth/Landing.jsx';
import RegisterPage from './components/Auth/Registration.jsx';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}

export default App;