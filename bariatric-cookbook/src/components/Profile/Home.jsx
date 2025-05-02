import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/logout.js';


const HomePage = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
    

  const handleSignOut = async () => {
    try {
      const logoutResponse = await logout();
      if (!logoutResponse.success) {
        setError('Logout failed. Please try again.');
        return;
      }
      navigate('/');
    }
    catch (error) {
      console.error("Unexpected logout error:", error);
      setError('Something went wrong. Please try again.');
    }
  };

    const handleGenerateMealPlan = () => {
    // Redirect to the meal plan generation page
    navigate('/meal-plan');
    };


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:8000/bariatric-cookbook/profile/`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        console.error(err);
        setError('Unable to load profile');
      }
    };

    fetchProfile();
  }, []);

  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg">
        {error}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Your Profile</h2>
        <div className="space-y-2 text-gray-700">
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Diet:</strong> {profile.diet || 'None specified'}</p>
          <p><strong>Allergies:</strong> {profile.allergies.length > 0 ? profile.allergies.join(', ') : 'None'}</p>
          <p><strong>Max Calories:</strong> {profile.max_calories}</p>
          <p><strong>Max Carbs:</strong> {profile.max_carbs}</p>
          <p><strong>Max Protein:</strong> {profile.max_protein}</p>
          <p><strong>Max Fat:</strong> {profile.max_fat}</p>
        </div>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={handleGenerateMealPlan}
          className="bg-green-600 text-gray px-6 py-2 rounded-lg hover:bg-green-600 transition"
        >
          Generate Meal Plan
        </button>
        <button
          onClick={handleSignOut}
          className="bg-red-500 text-gray px-6 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default HomePage;
