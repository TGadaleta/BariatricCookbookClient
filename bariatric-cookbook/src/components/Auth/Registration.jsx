// This code is a React component for a registration page. It includes form fields for username, email, password, and dietary preferences. The component handles form submission, validation, and displays error messages as needed. The design is responsive and uses Tailwind CSS for styling.
// The component also includes a success message upon successful registration. The form allows users to add allergies dynamically and provides input fields for maximum dietary limits.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../services/signup';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    allergyInput: '',
    allergies: [],
    max_calories: '',
    max_carbs: '',
    max_protein: '',
    max_fat: '',
  });

  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null); // success | error | null
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleAddAllergy = () => {
    if (formData.allergyInput.trim() !== '') {
      setFormData((prev) => ({
        ...prev,
        allergies: [...prev.allergies, prev.allergyInput.trim()],
        allergyInput: '',
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
  
    // Basic credential checks
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
  
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
  
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
  
    // Dietary preferences validation
    const numericFields = ['max_calories', 'max_carbs', 'max_protein', 'max_fat'];
    numericFields.forEach((field) => {
      const value = formData[field];
      if (value) {
        const parsed = parseFloat(value);
        if (isNaN(parsed)) newErrors[field] = 'Must be a number';
        else if (parsed < 0) newErrors[field] = 'Cannot be negative';
      }
    });
  
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitStatus('error');
    } else {
      try {
        const repone = await signup(formData);
        if (repone.success) {
          setSubmitStatus('success');
          navigate('/home'); // Redirect to home page or another page
        } else {
          setErrors({ server: repone.error });
          setSubmitStatus('error');
        }
      }
      catch (error) {
        console.error('Error during registration:', error);
        setSubmitStatus('error');
      }      
      console.log('Form submitted:', formData);
      setSubmitStatus('success');



      // Reset form (optional)
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        allergyInput: '',
        allergies: [],
        max_calories: '',
        max_carbs: '',
        max_protein: '',
        max_fat: '',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-xl space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Create an Account</h2>

        {submitStatus === 'success' && (
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm text-center">
            Registration successful!
          </div>
        )}
        {submitStatus === 'error' && Object.keys(errors).length > 0 && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm text-center">
            Please fix the errors below.
          </div>
        )}

        {/* === Account Credentials === */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Account Information</h3>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                errors.username ? 'border-red-500 focus:ring-red-300' : 'focus:ring-blue-400'
              }`}
            />
            {errors.username && <p className="text-red-600 text-sm mt-1">{errors.username}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                errors.email ? 'border-red-500 focus:ring-red-300' : 'focus:ring-blue-400'
              }`}
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                errors.password ? 'border-red-500 focus:ring-red-300' : 'focus:ring-blue-400'
              }`}
            />
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                errors.confirmPassword ? 'border-red-500 focus:ring-red-300' : 'focus:ring-blue-400'
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        {/* === Dietary Preferences === */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Dietary Preferences</h3>

          <div className="mb-2">
            <label className="block text-gray-700 mb-1">Allergies</label>
            {formData.allergies.length > 0 && (
              <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                {formData.allergies.map((a, idx) => (
                  <li key={idx}>{a}</li>
                ))}
              </ul>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                name="allergyInput"
                value={formData.allergyInput}
                onChange={handleChange}
                placeholder="e.g., peanuts"
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={handleAddAllergy}
                className="px-4 py-2 bg-blue-500 text-gray rounded-lg hover:bg-blue-600 transition"
              >
                Add
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-gray-700 mb-1">Max Calories</label>
              <input
                type="number"
                name="max_calories"
                value={formData.max_calories}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                    errors.max_calories ? 'border-red-500 focus:ring-red-300' : 'focus:ring-blue-400'
                  }`}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Max Carbs</label>
              <input
                type="number"
                name="max_carbs"
                value={formData.max_carbs}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                    errors.max_carbs ? 'border-red-500 focus:ring-red-300' : 'focus:ring-blue-400'
                  }`}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Max Protein</label>
              <input
                type="number"
                name="max_protein"
                value={formData.max_protein}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                    errors.max_protein ? 'border-red-500 focus:ring-red-300' : 'focus:ring-blue-400'
                  }`}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Max Fat</label>
              <input
                type="number"
                name="max_fat"
                value={formData.max_fat}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                    errors.max_fat ? 'border-red-500 focus:ring-red-300' : 'focus:ring-blue-400'
                  }`}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-green-500 text-gray py-2 rounded-lg hover:bg-green-600 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;