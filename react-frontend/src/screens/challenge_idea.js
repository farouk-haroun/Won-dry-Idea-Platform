// src/screens/challenge_idea.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  Star,
  Share2,
  Search,
  Bell,
  Menu,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import ProfilePopup from '../components/ProfilePopup';
import { API_BASE_URL } from '../utils/constants';

// Helper component for star rating
const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 ${
            star <= rating ? 'text-purple-600 fill-purple-600' : 'text-purple-600'
          }`}
        />
      ))}
      <span className="ml-2 text-gray-700">{rating}</span>
    </div>
  );
};

// Admin feedback form component
const AdminFeedbackForm = ({ feedback, setFeedback, submitFeedback }) => {
  const handleStarClick = (category, rating) => {
    setFeedback((prev) => ({
      ...prev,
      [category]: rating,
    }));
  };

  return (
    <div className="bg-white rounded-lg p-6 border mb-6">
      <h2 className="text-xl font-bold mb-4">Provide Feedback</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {['scalability', 'sustainability', 'innovation', 'impact'].map((category) => (
          <div key={category} className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-gray-600 mb-2">{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 cursor-pointer ${
                    star <= feedback[category] ? 'text-purple-600 fill-purple-600' : 'text-purple-300'
                  }`}
                  onClick={() => handleStarClick(category, star)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mb-4">
        <h3 className="text-gray-600 mb-2">Additional Comments</h3>
        <textarea
          className="w-full p-3 border rounded-lg resize-none"
          rows="4"
          placeholder="Add Feedback"
          value={feedback.comments}
          onChange={(e) => setFeedback((prev) => ({ ...prev, comments: e.target.value }))}
        />
      </div>
      <div className="flex gap-4">
        <button onClick={submitFeedback} className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
          Submit Feedback
        </button>
      </div>
    </div>
  );
};

const IdeaNavigation = () => {
  return (
    <div className="flex justify-between mt-6">
      <button className="flex items-center px-6 py-2 border rounded-full hover:bg-gray-50 transition-colors">
        <ChevronLeft className="w-5 h-5 mr-2" />
        Previous Idea
      </button>
      <button className="flex items-center px-6 py-2 border rounded-full text-purple-600 hover:bg-purple-50 transition-colors">
        Next Idea
        <ChevronRight className="w-5 h-5 ml-2" />
      </button>
    </div>
  );
};

const ChallengeIdea = ({ isAdmin }) => {
  const { id } = useParams();
  const [idea, setIdea] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState({
    scalability: 0,
    sustainability: 0,
    innovation: 0,
    impact: 0,
    comments: '',
  });

  const handleBack = () => {
    navigate(-1);
  };

  // Fetch idea details
  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/ideas/${id}`);
        setIdea(response.data);
      } catch (error) {
        console.error('Failed to fetch idea:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIdea();
  }, [id]);

  const submitFeedback = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/ideas/${id}/feedback`, feedback);
      alert('Feedback submitted');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  if (isLoading) {
    return (
      <div data-testid="loading-spinner">
        Loading...
      </div>
    );
  }

  if (!idea) {
    return (
      <div>
        <p>You are not authorized to view this challenge.</p>
      </div>
    );
  }

  return (
    <div className="bg-white" data-testid="challenge-idea-component">
      <header className="flex items-center justify-between p-4 border-b">
        <Link to="/">
          <img src="/main_logo.svg" alt="Wondry Logo" className="h-8" />
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-700">Home</Link>
          <Link to="/discover" className="text-gray-700">Discover</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Search className="text-gray-500 cursor-pointer" />
          <Bell className="text-gray-500 cursor-pointer" />
          <Menu className="text-gray-500 md:hidden cursor-pointer" />
          <div className="relative">
            <div
              className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white cursor-pointer"
              onClick={() => setShowProfilePopup(!showProfilePopup)}
            >
              MM
            </div>
            {showProfilePopup && (
              <ProfilePopup onClose={() => setShowProfilePopup(false)} onLogout={() => navigate('/login')} />
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <button className="mr-4" onClick={handleBack}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold flex-grow">{idea.title}</h1>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-md" onClick={() => navigate('/idea')}>
            Open Idea Board
          </button>
          <button className="border border-gray-300 rounded-full p-2 ml-2">
            <Star className="w-5 h-5" />
          </button>
          <button className="border border-gray-300 rounded-full p-2 ml-2">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-2">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-bold">
                  1. What social, economic, and environmental sustainability priorities does your idea represent?
                </h3>
                <p className="text-gray-700">{idea.content}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-4 border">
              <h3 className="font-bold mb-4">Team</h3>
              <div className="grid grid-cols-2 gap-2">
                {idea.team.map((member, index) => (
                  <div key={index} className="flex items-center bg-gray-100 rounded-full py-2 px-4">
                    <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full mr-2" />
                    <span className="text-sm">{member.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border">
              <h3 className="font-bold mb-4">Challenge</h3>
              <p className="text-gray-700">{idea.challenge.title}</p>
              <p className="text-gray-500">{idea.challenge.category}</p>
            </div>

            <div className="bg-white rounded-lg p-4 border">
              <h2 className="text-xl font-bold mb-4">Organizer Feedback</h2>
              <div className="grid grid-cols-2 gap-4">
                {['scalability', 'sustainability', 'innovation', 'impact'].map((category) => (
                  <div key={category} className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-gray-600 mb-2">{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                    <StarRating rating={idea.feedback[category]} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {isAdmin && <AdminFeedbackForm feedback={feedback} setFeedback={setFeedback} submitFeedback={submitFeedback} />}
        <IdeaNavigation />
      </div>
    </div>
  );
};

export default ChallengeIdea;
