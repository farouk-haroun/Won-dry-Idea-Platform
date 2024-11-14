import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const ProfileSettingsPopup = ({ isOpen, onClose, userProfile, onUpdateProfile }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    interests: '',
    skills: ''
  });

  // Update form data when userProfile changes
  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        email: userProfile.email || '',
        department: userProfile.department || '',
        interests: Array.isArray(userProfile.interests) 
          ? userProfile.interests.join(', ') 
          : userProfile.interests || '',
        skills: Array.isArray(userProfile.skills)
          ? userProfile.skills.join(', ')
          : userProfile.skills || ''
      });
    }
  }, [userProfile]);

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
      const token = localStorage.getItem('token');
      const updatedData = {
        name: formData.name,
        email: formData.email,
        department: formData.department,
        interests: formData.interests.split(',').map(item => item.trim()),
        skills: formData.skills.split(',').map(item => item.trim())
      };

      const response = await axios.put(
        `${API_BASE_URL}/users/profile`,
        updatedData,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        onUpdateProfile(response.data.user);
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Department:</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., Computer Science"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Interests (comma-separated):</label>
            <input
              type="text"
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., AI, Web Development, IoT"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Skills (comma-separated):</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., JavaScript, Python, React"
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
