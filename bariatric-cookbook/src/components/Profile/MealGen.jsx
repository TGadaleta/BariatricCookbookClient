import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { promptGeneration } from "../../services/promptGeneration";

const MealGen = () => {
  const [profile, setProfile] = useState(null);
  const [cuisine, setCuisine] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [days, setDays] = useState(1);
  const [mealsPerDay, setMealsPerDay] = useState(1);

  // ✅ Add state to store the response
  const [responseData, setResponseData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/bariatric-cookbook/profile/`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile) {
      console.error("Profile not loaded");
      return;
    }

    const payload = {
      preferences: {
        cuisine: cuisine || "",
        ingredients: ingredients || "",
        max_calories: profile.max_calories,
        diet: profile.diet,
        max_fat: profile.max_fat,
        max_protein: profile.max_protein,
        max_carbs: profile.max_carbs,
      },
      days,
      mealsPerDay,
    };

    try {
      const { success, data, error } = await promptGeneration(payload);
      if (success) {
        setResponseData(data); // ✅ Set the response to display
      } else {
        console.error("API Error:", error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Generate Your Meal Plan</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form Inputs */}
        <div>
          <label>Cuisine (optional):</label>
          <input
            type="text"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Ingredients (optional):</label>
          <input
            type="text"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Number of Days:</label>
          <input
            type="number"
            min="1"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Meals per Day:</label>
          <input
            type="number"
            min="1"
            value={mealsPerDay}
            onChange={(e) => setMealsPerDay(Number(e.target.value))}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-gray px-4 py-2 rounded hover:bg-blue-600"
        >
          Generate Meal Plan
        </button>
      </form>

      {responseData && responseData.meal_plan && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="font-bold mb-2">Generated Meal Plan:</h2>
          <div className="prose whitespace-pre-wrap text-sm">
            <ReactMarkdown>{responseData.meal_plan}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealGen;
