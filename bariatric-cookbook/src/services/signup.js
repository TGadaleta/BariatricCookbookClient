import { login } from "./login";


export const signup = async (formData) => {
    const registerUrl = 'http://localhost:8000/bariatric-cookbook/register/';

    try {
      // Register the user
      const registerResponse = await fetch(registerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          allergies: formData.allergies,
          max_calories: formData.max_calories,
          max_carbs: formData.max_carbs,
          max_protein: formData.max_protein,
          max_fat: formData.max_fat,
        }),
      });
  
      if (!registerResponse.ok) {
        const errData = await registerResponse.json();
        throw new Error(errData.error || 'Registration failed.');
      }
  
      // Log the user in
      const loginResponse = await login(formData.username, formData.password);
      if (!loginResponse.success) {
        throw new Error(loginResponse.error || 'Login failed after registration.');
      }
      return { success: true };
    }
    catch (error) {
      return { success: false, error: error.message };
    }
  }