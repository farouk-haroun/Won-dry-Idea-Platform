import React, { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt with:', { email, password });
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
              className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-900 transition duration-300 font-medium mb-4"
            >
              Non-VU Log In
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
            <a href="#" className="text-sm text-gray-600 hover:underline">Sign Up</a>
          </div>
        </div>
      </div>
      </div>
  );
}

export default Login;
