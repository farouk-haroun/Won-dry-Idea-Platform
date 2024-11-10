// src/screens/challenge_idea.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

const AdminFeedbackForm = ({ feedback, setFeedback }) => {
  const handleStarClick = (category, rating) => {
    setFeedback((prev) => ({
      ...prev,
      [category]: rating,
    }));
  };

  const renderStarRating = (category) => {
    return (
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
    );
  };

  return (
    <div className="bg-white rounded-lg p-6 border mb-6">
      <h2 className="text-xl font-bold mb-4">Provide Feedback</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {['scalability', 'sustainability', 'innovation', 'impact'].map((category) => (
          <div key={category} className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-gray-600 mb-2">{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
            {renderStarRating(category)}
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
        <button className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors">
          Reject
        </button>
        <button className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
          Move to Next Stage
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

const ChallengeIdea = ({ idea, isAdmin, isLoading }) => {
  const [activeTab, setActiveTab] = useState('idea');
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState({
    scalability: 0,
    sustainability: 0,
    innovation: 0,
    impact: 0,
    comments: '',
  });

  const handleLogout = () => {
    navigate('/login');
  };

  const handleBack = () => {
    navigate(-1);
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
          <Link to="/" className="text-gray-700">
            Home
          </Link>
          <Link to="/discover" className="text-gray-700">
            Discover
          </Link>
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
              <ProfilePopup onClose={() => setShowProfilePopup(false)} onLogout={handleLogout} />
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
            {activeTab === 'idea' ? (
              <div className="space-y-6">
                {/* Idea content */}
                <div className="space-y-4">
                  <h3 className="font-bold">
                    1. What social, economic and environmental sustainability priorities does your idea represent?
                  </h3>
                  <p className="text-gray-700">{idea.content}</p>
                  {/* Add other questions and answers similarly */}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Comments section */}
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="border-b pb-4">
                      <div className="flex items-center mb-2">
                        <img src={idea.team[0].avatar} alt="" className="w-8 h-8 rounded-full mr-2" />
                        <div>
                          <p className="font-semibold">{idea.author}</p>
                          <p className="text-sm text-gray-500">{idea.timestamp}</p>
                        </div>
                      </div>
                      <p>{idea.content}</p>
                      <button className="flex items-center mt-2 text-gray-500">
                        <span className="mr-1">👍</span> {idea.likes}
                      </button>
                    </div>
                  ))}
              </div>
            )}
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

            <div className="bg-white rounded-lg p-4 border" data-testid="challenge-card">
              <h2 className="text-xl font-bold mb-4">Key Metrics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-gray-600 mb-2">Status</h3>
                  <p className="text-red-500 flex items-center">
                    {idea.metrics.status}
                    <span className="ml-1 cursor-help" title="This idea was not selected">
                      ⓘ
                    </span>
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-gray-600 mb-2">Rate</h3>
                  <StarRating rating={idea.metrics.rate} />
                </div>
              </div>
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

        {isAdmin && <AdminFeedbackForm feedback={feedback} setFeedback={setFeedback} />}
        <IdeaNavigation />
      </div>
    </div>
  );
};

export default ChallengeIdea;
