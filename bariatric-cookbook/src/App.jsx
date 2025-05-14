import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/Auth/Landing.jsx';
import RegisterPage from './components/Auth/Registration.jsx';
import HomePage from './components/Profile/Home.jsx';
import MealGenPage from './components/Profile/MealGen.jsx';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/meal-plan" element={<MealGenPage />} />
      {/* Add more routes as needed */}
    </Routes>
  );
}

export default App;