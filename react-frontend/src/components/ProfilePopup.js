import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, FileText, File, Settings } from 'lucide-react';
import axios from 'axios';


const { API_BASE_URL } =require('../utils/constants');

const ProfilePopup = ({ onClose }) => {
  const navigate = useNavigate(); // This is used to navigate after logging out.
  
  const handleLogout = async () => {
    console.log('Logging out...');
    try {
      
      // Optionally, you can call the backend to notify it of the logout
      console.log(`${API_BASE_URL}/users/login`);
      const response = await axios.post(`${API_BASE_URL}/users/logout`, {}, {
        withCredentials: true, // Only if you are handling cookies in your app
      });

      if (response.status === 200) {
        console.log('Logout successful');

        // Remove the JWT from localStorage (or cookies if you're storing it there)
        localStorage.removeItem('token');  // Clear the token
        // If you are storing JWT in cookies, you can clear the cookie as well
        // document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        // Redirect to login or home page
        navigate('/login');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
      <Link
        to="/profile"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
        onClick={onClose}
      >
        <User className="mr-2 h-4 w-4" />
        My Profile
      </Link>
      <Link
        to="/profile"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
        onClick={onClose}
      >
        <FileText className="mr-2 h-4 w-4" />
        My Content
      </Link>
      <Link
        to="/profile"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
        onClick={onClose}
      >
        <File className="mr-2 h-4 w-4" />
        My Drafts
      </Link>
      <Link
        to="/account-settings"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
        onClick={onClose}
      >
        <Settings className="mr-2 h-4 w-4" />
        Account Settings
      </Link>
      <button
        onClick={() => {
          handleLogout();
        }}
        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </button>
    </div>
  );
};

export default ProfilePopup;
