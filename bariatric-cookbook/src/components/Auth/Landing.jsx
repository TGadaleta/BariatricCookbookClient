import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/login.js';

const LandingPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const loginResponse = await login(username, password);
      if (!loginResponse.success) {
        return { success: false, errors: { server: loginResponse.error || 'Login failed.' } };
      }
      navigate('/home');
      return { success: true };
    } catch (error) {
      console.error("Unexpected login error:", error);
      return { success: false, errors: { server: 'Something went wrong. Please try again.' } };
    }
  };
  

  const handleRegister = () => {
    console.log('Heading to registration page');
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Welcome to the Bariatric Cookbook</h1>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your username"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your password"
          />
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleSignIn}
            className="bg-blue-500 text-gray py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Sign In
          </button>
          <button
            onClick={handleRegister}
            className="bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
