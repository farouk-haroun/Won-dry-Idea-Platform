import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const ProfileSettingsPopup = ({ isOpen, onClose, userProfile, onUpdateProfile }) => {
  const [formData, setFormData] = useState({
    language: 'English',
    departmentName: userProfile?.department || '',
    phoneNumber: '',
    interests: '',
    website: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_BASE_URL}/users/profile`, formData);
      if (response.status === 200) {
        onUpdateProfile(response.data);
        onClose();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-semibold text-center text-[#874c9e] mb-8">Profile Settings</h2>

        <div className="flex items-center space-x-6 mb-8">
          <div className="w-24 h-24 bg-[#2c2c2c] rounded-full flex items-center justify-center text-white text-3xl">
            MM
          </div>
          <div>
            <h3 className="text-xl font-semibold">{userProfile?.name}</h3>
            <p className="text-gray-600">Email: {userProfile?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">Language:</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Department Name:</label>
            <input
              type="text"
              name="departmentName"
              placeholder="Optional"
              value={formData.departmentName}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Phone Number:</label>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Optional"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Interests:</label>
            <input
              type="text"
              name="interests"
              placeholder="Optional"
              value={formData.interests}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Website:</label>
            <input
              type="url"
              name="website"
              placeholder="Optional"
              value={formData.website}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#874c9e] text-white py-3 rounded-lg hover:bg-[#763c8e] transition-colors mt-8"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettingsPopup;
