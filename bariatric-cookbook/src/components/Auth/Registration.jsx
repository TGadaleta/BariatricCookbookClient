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
    max_calories: '0',
    max_carbs: '0',
    max_protein: '0',
    max_fat: '0',
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
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

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
        const response = await signup(formData);
        if (response.success) {
          setSubmitStatus('success');
          setErrors({});
          setFormData({
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            allergyInput: '',
            allergies: [],
            max_calories: '0',
            max_carbs: '0',
            max_protein: '0',
            max_fat: '0',
          });
          navigate('/home');
        } else {
          setErrors(response.errors || { server: 'Registration failed.' });
          setSubmitStatus('error');
        }
      } catch (error) {
        console.error('Error during registration:', error);
        setErrors({ server: 'An unexpected error occurred.' });
        setSubmitStatus('error');
      }
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
            {['max_calories', 'max_carbs', 'max_protein', 'max_fat'].map((field) => (
              <div key={field}>
                <label className="block text-gray-700 mb-1">
                  {field.replace('max_', 'Max ').replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </label>
                <input
                  type="number"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                    errors[field] ? 'border-red-500 focus:ring-red-300' : 'focus:ring-blue-400'
                  }`}
                />
                {errors[field] && (
                  <p className="text-red-600 text-sm mt-1">{errors[field]}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {errors.server && (
          <div className="text-red-600 text-center text-sm">{errors.server}</div>
        )}

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
