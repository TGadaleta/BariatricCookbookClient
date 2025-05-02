import { getCSRFToken } from "./csrf";

export const logout = async () => {
  const logoutUrl = "http://localhost:8000/bariatric-cookbook/logout/";

  try {
    const response = await fetch(logoutUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCSRFToken(),
      },
    });

    if (!response.ok) {
      throw new Error("Logout failed.");
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}