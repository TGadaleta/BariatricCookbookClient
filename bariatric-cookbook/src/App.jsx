import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/Auth/Landing.jsx';
import RegisterPage from './components/Auth/Registration.jsx';
import HomePage from './components/Profile/Home.jsx';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/home" element={<HomePage />} />
    </Routes>
  );
}

export default App;