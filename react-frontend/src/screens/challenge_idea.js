import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Share2, Search, Bell, Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import ProfilePopup from '../components/ProfilePopup';

// Add this helper component for star rating at the top of the file, after the imports
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

const AdminFeedbackForm = () => {
  const [feedback, setFeedback] = useState({
    scalability: 0,
    sustainability: 0,
    innovation: 0,
    impact: 0,
    comments: ''
  });

  const handleStarClick = (category, rating) => {
    setFeedback(prev => ({
      ...prev,
      [category]: rating
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
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-gray-600 mb-2">Scalability</h3>
          {renderStarRating('scalability')}
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-gray-600 mb-2">Sustainability</h3>
          {renderStarRating('sustainability')}
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-gray-600 mb-2">Innovation</h3>
          {renderStarRating('innovation')}
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-gray-600 mb-2">Impact</h3>
          {renderStarRating('impact')}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-gray-600 mb-2">Additional Comments</h3>
        <textarea
          className="w-full p-3 border rounded-lg resize-none"
          rows="4"
          placeholder="Enter your feedback..."
          value={feedback.comments}
          onChange={(e) => setFeedback(prev => ({ ...prev, comments: e.target.value }))}
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

const ChallengeIdea = () => {
  const [activeTab, setActiveTab] = useState('idea');
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const navigate = useNavigate();
  const [isAdmin] = useState(true);

  // Test data
  const idea = {
    title: "United by Better Coffee",
    author: "John Doe",
    timestamp: "2024/09/20 08:36",
    content: "My main concern is knowing that the roaster/coffee shop has the higher margins, how would they feel (or would they be willing to share) the % and information of the poster?",
    likes: 50,
    team: [
      { name: "John Doe", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
      { name: "Samantha Pene", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
      { name: "Michael Sybil", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
      { name: "Jane Doe", avatar: "https://randomuser.me/api/portraits/women/4.jpg" },
    ],
    challenge: {
      title: "Commodore Cup 2023 Sustainability Challenge",
      category: "Social Innovation"
    },
    metrics: {
      status: "Rejected",
      rate: 3.5
    },
    feedback: {
      scalability: 3.5,
      sustainability: 3.5,
      innovation: 3.5,
      impact: 3.5
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-white">
      <header className="flex items-center justify-between p-4 border-b">
        <Link to="/">
          <img src="/main_logo.svg" alt="Wondry Logo" className="h-8" />
        </Link>
        
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-700">Home</Link>
          <Link to="/discover" className="text-gray-700">Discover</Link>
          <Link to="/analytics" className="text-gray-700">Analytics</Link>
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
              <ProfilePopup 
                onClose={() => setShowProfilePopup(false)}
                onLogout={handleLogout}
              />
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
          <button 
            className="bg-purple-600 text-white px-4 py-2 rounded-md"
            onClick={() => navigate('/idea')}>
            Open Idea Board
          </button>
          <button className="border border-gray-300 rounded-full p-2 ml-2">
            <Star className="w-5 h-5" />
          </button>
          <button className="border border-gray-300 rounded-full p-2 ml-2">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {['1st Evaluation', '2nd Round Evaluation', 'Final Showcase', 'Winners Announcement'].map((stage, index) => (
            <div key={index} className={`p-4 rounded-md ${index === 3 ? 'bg-green-100' : 'bg-gray-100'}`}>
              <h3 className="font-semibold mb-1">{stage}</h3>
              <p className="text-sm text-gray-600">0 Ideas</p>
              <p className="text-sm text-gray-600">
                {index === 3 ? 'Open' : 'Closed 29 Apr 2023'}
              </p>
            </div>
          ))}
        </div>

        <div className="flex mb-8">
          <button 
            className={`px-4 py-2 rounded-md mr-2 ${activeTab === 'idea' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
            onClick={() => setActiveTab('idea')}
          >
            Idea
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${activeTab === 'comments' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
            onClick={() => setActiveTab('comments')}
          >
            Comments
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-2">
            {activeTab === 'idea' ? (
              <div className="space-y-6">
                {/* Questions and answers */}
                <div className="space-y-4">
                  <h3 className="font-bold">1. What social, economic and environmental sustainability priorities does your idea represent?</h3>
                  <p className="text-gray-700">Our idea is to humanize coffee, so it has a greater representation of social sustainability priorities, but it has elements that are economic and environmental as well. What our idea aims to do is to illustrate that the economic and environmental issues in this sector are interconnected with each other and to the social ones. We are specifically focusing on recognizing the coffee farmers and the inequity surrounding their role from production to consumption.</p>
                  
                  {/* Add other questions and answers similarly */}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Comments section */}
                {Array(5).fill(0).map((_, index) => (
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

            <div className="bg-white rounded-lg p-4 border">
              <h2 className="text-xl font-bold mb-4">Key Metrics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-gray-600 mb-2">Status</h3>
                  <p className="text-red-500 flex items-center">
                    Rejected
                    <span className="ml-1 cursor-help" title="This idea was not selected">ⓘ</span>
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
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-gray-600 mb-2">Scalability</h3>
                  <StarRating rating={idea.feedback.scalability} />
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-gray-600 mb-2">Sustainability</h3>
                  <StarRating rating={idea.feedback.sustainability} />
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-gray-600 mb-2">Innovation</h3>
                  <StarRating rating={idea.feedback.innovation} />
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-gray-600 mb-2">Impact</h3>
                  <StarRating rating={idea.feedback.impact} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {isAdmin && <AdminFeedbackForm />}
        <IdeaNavigation />
      </div>
    </div>
  );
};

export default ChallengeIdea;
