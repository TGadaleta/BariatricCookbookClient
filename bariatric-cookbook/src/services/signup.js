import { login } from "./login";
import { getCSRFToken } from './csrf.js';

export const signup = async (formData) => {
  const registerUrl = 'http://localhost:8000/bariatric-cookbook/register/';

  try {
    const registerResponse = await fetch(registerUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRFToken': getCSRFToken(),
      },
      credentials: 'include',
      body: JSON.stringify({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        diet: formData.diet,
        allergies: formData.allergies,
        max_calories: formData.max_calories,
        max_carbs: formData.max_carbs,
        max_protein: formData.max_protein,
        max_fat: formData.max_fat,
      }),
    });

    const result = await registerResponse.json();

    if (!registerResponse.ok) {
      // Return full error object (e.g., { username: [...], email: [...] })
      return { success: false, errors: result };
    }

    // Try login here if registration was successful
    const loginResponse = await login(formData.username, formData.password);
    if (!loginResponse.success) {
      return { success: false, errors: { server: 'Login failed after registration.' } };
    }
    return { success: true };
  } catch (error) {
    return { success: false, errors: { server: 'Network error. Please try again.' } };
  }
};
