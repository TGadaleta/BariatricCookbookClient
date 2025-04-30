export const login = async (username, password) => {
    const loginUrl = 'http://localhost:8000/bariatric-cookbook/login/';
    try {
        const response = await fetch(loginUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Login failed.');
        }

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}