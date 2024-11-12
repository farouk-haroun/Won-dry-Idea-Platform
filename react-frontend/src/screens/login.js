import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../store/authSlice';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authError = useSelector(state => state.auth.error);

  useEffect(() => {
    // Clear any existing errors when the component mounts
    dispatch(clearError());
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/discover');
    }
  }, [dispatch, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_BASE_URL}/users/login`, { 
        email, 
        password 
      });
      
      if (response.data && response.data.token) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        
        // Update auth state
        dispatch(login({
          user: response.data.user,
          token: response.data.token
        }));
        
        // Navigate to discover page
        navigate('/discover');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Invalid credentials. Please try again.');
      dispatch(clearError());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left side with logo */}
      <div className="hidden md:flex md:w-1/2 bg-blue-600 justify-center items-center">
        <img src="/logo.svg" alt="Logo" className="w-156 h-156" />
      </div>

      {/* Right side with login form */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-8">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2 text-left">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2 text-left">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-900 transition duration-300 font-medium mb-4 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Logging in...' : 'Non-VU Log In'}
            </button>
            <button
              type="button"
              className="w-full bg-white text-gray-800 py-2 px-4 rounded-md border border-gray-300 hover:bg-gray-50 transition duration-300 font-medium flex items-center justify-center"
            >
              <span className="text-yellow-500 mr-2 font-bold">V</span> VU Log In
            </button>
          </form>
          <div className="mt-6 flex justify-between">
            <a href="#" className="text-sm text-gray-600 hover:underline">Forgot password?</a>
            <Link to="/signup" className="text-sm text-blue-600 hover:underline">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
