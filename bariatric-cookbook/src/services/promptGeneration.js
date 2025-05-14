import { getCSRFToken } from "./csrf";

export const promptGeneration = async ({ preferences, days, mealsPerDay}) => {
  const apiUrl = "http://localhost:8000/openai/generate-meal-plan/";
  const csrfToken = getCSRFToken();
  if (!csrfToken) {
    throw new Error("CSRF token not found");
  }
  
  const payload = {
    preferences,
    days,
    mealsPerDay,
  };

  try {
   const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to generate meal plan");
    }
    const data = await response.json();
    console.log("Meal plan response data:", data);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}