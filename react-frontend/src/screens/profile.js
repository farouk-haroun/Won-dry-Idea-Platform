import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, Filter, Edit2, Settings } from 'lucide-react';
import ProfilePopup from '../components/ProfilePopup';
import ChallengeCard from '../components/ChallengeCard';
import ProfileSettingsPopup from '../components/ProfileSettingsPopup';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const Profile = () => {
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [activeTab, setActiveTab] = useState('Challenges');
  const [challenges, setChallenges] = useState([]);
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    points: 0,
    role: 'user',
    department: '',
    createdAt: '',
    interests: [],
    skills: []
  });
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
    // fetchUserChallenges();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const userData = response.data;
      const formattedDate = new Date(userData.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      });

      console.log(userData);

      setUserProfile({
        ...userData,
        name: userData.name || 'Anonymous User',
        department: userData.department || 'Not specified',
        points: userData.points || 0,
        interests: userData.interests || [],
        skills: userData.skills || [],
        createdAt: formattedDate
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const fetchUserChallenges = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/challenges/user-challenges`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setChallenges(response.data);
    } catch (error) {
      console.error('Error fetching user challenges:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleProfileUpdate = async (updatedProfile) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_BASE_URL}/users/profile`,
        updatedProfile,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.user) {
        const userData = response.data.user;
        const formattedDate = new Date(userData.createdAt).toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric'
        });

        setUserProfile(prev => ({
          ...prev,
          ...userData,
          department: userData.department || 'Not specified',
          createdAt: formattedDate
        }));
      }
      setShowProfileSettings(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="bg-[#fdfbf6] min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white">
        <div className="flex items-center">
          <Link to="/">
            <img src="/main_logo.svg" alt="Wondry Logo" className="h-12 mr-4" />
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-[#2c2c2c] text-xl">
              Home
            </Link>
            <Link to="/discover" className="text-[#2c2c2c] text-xl">
              Discover
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Search className="text-gray-500 cursor-pointer" />
          <Bell className="text-gray-500 cursor-pointer" />
          <Menu className="text-gray-500 md:hidden cursor-pointer" />
          <div className="relative">
            <div
              data-testid="profile-avatar"
              className="w-14 h-14 bg-[#2c2c2c] rounded-full flex items-center justify-center text-white text-xl cursor-pointer"
              onClick={() => setShowProfilePopup(!showProfilePopup)}
            >
              MM
            </div>
            {showProfilePopup && (
              <ProfilePopup onClose={() => setShowProfilePopup(false)} onLogout={handleLogout} />
            )}
          </div>
        </div>
      </header>

      {/* Profile Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-6">
            <div className="w-32 h-32 bg-[#2c2c2c] rounded-full flex items-center justify-center text-white text-4xl">
              MM
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{userProfile.name}</h1>
                  <p className="text-gray-600">{userProfile.email}</p>
                </div>
                <div className="flex space-x-4">
                  <button
                    className="flex items-center space-x-2 px-4 py-2 border rounded-full hover:bg-gray-50"
                    onClick={() => setShowProfileSettings(true)}
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 border rounded-full hover:bg-gray-50">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                </div>
              </div>
              <div className="mt-4 flex space-x-6">
                <div>
                  <span className="text-gray-600">Role:</span>
                  <span className="ml-2 font-medium">{userProfile.role || 'User'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Department:</span>
                  <span className="ml-2 font-medium">{userProfile.department || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Joined:</span>
                  <span className="ml-2 font-medium">{userProfile.createdAt || 'Not available'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProfileSettingsPopup
        isOpen={showProfileSettings}
        onClose={() => setShowProfileSettings(false)}
        userProfile={userProfile}
        onUpdateProfile={handleProfileUpdate}
      />

      {/* Content Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex space-x-6 border-b">
          <button
            className={`px-4 py-2 ${
              activeTab === 'Challenges' ? 'border-b-2 border-[#874c9e] text-[#874c9e]' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('Challenges')}
          >
            My Challenges
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === 'Ideas' ? 'border-b-2 border-[#874c9e] text-[#874c9e]' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('Ideas')}
          >
            My Ideas
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === 'Drafts' ? 'border-b-2 border-[#874c9e] text-[#874c9e]' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('Drafts')}
          >
            Drafts
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === 'Favorites' ? 'border-b-2 border-[#874c9e] text-[#874c9e]' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('Favorites')}
          >
            Favorites
          </button>
        </div>

        {/* Content Grid */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search your content..."
                className="pl-10 pr-4 py-2 border rounded-lg w-64"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            <div className="flex items-center space-x-4">
              <select className="border rounded-lg px-4 py-2" data-testid="sort-select">
                <option>Sort by: Recent</option>
                <option>Sort by: Popular</option>
                <option>Sort by: Title</option>
              </select>
              <button className="flex items-center space-x-2 text-[#874c9e]">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>

          {challenges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.map((challenge) => (
                <ChallengeCard key={challenge._id} challenge={challenge} />
              ))}
            </div>
          ) : (
            <p data-testid="no-challenges-message">No challenges found.</p>
          )}
        </div>
      </div>

      <footer className="bg-white py-8 text-center mt-16">
        <p className="text-gray-600">Wondry © 2024</p>
      </footer>
    </div>
  );
};

export default Profile;
