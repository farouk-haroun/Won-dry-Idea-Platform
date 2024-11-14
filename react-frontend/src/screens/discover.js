import React, { useState, useEffect } from 'react';
import { Search, Bell, Menu, Filter, X, Calendar, ChevronDown } from 'lucide-react';
import ChallengeCard from '../components/ChallengeCard';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { Link, useNavigate } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import ProfilePopup from '../components/ProfilePopup';
import AdminCreateChallengePopup from '../components/AdminCreateChallengePopup';

const Discover = () => {
  const [selectedOptions, setSelectedOptions] = useState(['Challenges']);
  const [challenges, setChallenges] = useState([]);
  
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [filterOptions, setFilterOptions] = useState({
    myContent: false,
    followedContent: false,
    myEvaluations: false,
    archived: false,
    category: 'SUSTAINABILITY',
    status: 'DRAFT',
    publishDateFrom: '2024-08-25',
    publishDateTo: '2024-09-05',
    keywords: ['SUSTAINABILITY'],
  });
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showCreateChallenge, setShowCreateChallenge] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // If searchQuery is empty, fetch all challenges; otherwise, search
    if (searchQuery.trim() === '') {
      fetchChallenges();
    } else {
      searchChallenges();
    }
  }, [searchQuery]);

  // useEffect(() => {
  //   if (searchQuery === '') {
  //     fetchChallenges();
  //   }
  // }, [searchQuery]);
  
  const fetchChallenges = async (sortBy) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/challenges/challenges`, {
        params: { sortBy },
      });
      // console.log(response.data);
      
      setChallenges(response.data);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
  };
  // Search challenges with sorting
const searchChallenges = async (sortBy) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/challenges/search`, {
      params: { title: searchQuery, sortBy },
    });
    setChallenges(response.data);
  } catch (error) {
    console.error('Error searching challenges:', error);
  }
};
const handleChallengeDeleted = (deletedId) => {
  setChallenges((prevChallenges) => prevChallenges.filter((challenge) => challenge._id !== deletedId));
  setFeedbackMessage("Challenge has been deleted successfully!");
  setTimeout(() => setFeedbackMessage(null), 3000); // Clear message after 3 seconds
};

const handleChallengeArchived = (archivedId) => {
  setChallenges((prevChallenges) =>
    prevChallenges.map((challenge) =>
      challenge._id === archivedId ? { ...challenge, status: 'archived' } : challenge
    )
  );
  setFeedbackMessage("Challenge has been archived successfully!");
  setTimeout(() => setFeedbackMessage(null), 3000); // Clear message after 3 seconds
};


// Handle sort change
const handleSortChange = (e) => {
  const sortBy = e.target.value;
  if (searchQuery) {
    searchChallenges(sortBy);
  } else {
    fetchChallenges(sortBy);
  }
};

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === '') {
      fetchChallenges(); // Show all challenges if search query is empty
    } else {
      searchChallenges();
    }
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const isSelected = (option) => selectedOptions.includes(option);

  const toggleOption = (option) => {
    setSelectedOptions(prevSelected => {
      if (prevSelected.includes(option)) {
        if (prevSelected.length === 1) return prevSelected;
        return prevSelected.filter(item => item !== option);
      } else {
        return [...prevSelected, option];
      }
    });
  };

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  const handleFilterChange = (key, value) => {
    setFilterOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleKeywordAdd = (keyword) => {
    if (keyword && !filterOptions.keywords.includes(keyword)) {
      setFilterOptions(prev => ({ ...prev, keywords: [...prev.keywords, keyword] }));
    }
  };

  const handleKeywordRemove = (keyword) => {
    setFilterOptions(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const handleLogout = () => {
    // Implement logout logic here
    // For example: clear local storage, reset auth state, etc.
    navigate('/login');
  };

  return (
    <div className="bg-white p-16">
      <header className="flex items-center justify-between mb-4">
        <Link to="/">
          <img src="/main_logo.svg" alt="Wondry Logo" className="h-12" />
        </Link>
        
        <nav className="hidden md:flex space-x-6 flex-grow justify-center">
          <Link to="/" className="text-gray-700">Home</Link>
          <Link to="/discover" className="text-purple-600 font-semibold">Discover</Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Search className="text-gray-500 cursor-pointer" />
          <Bell className="text-gray-500 cursor-pointer" />
          <button
            onClick={() => setShowCreateChallenge(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create Challenge
          </button>
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
      {feedbackMessage && <div className="bg-yellow-100 text-yellow-800 p-2 mb-4 rounded">{feedbackMessage}</div>}
      <div className="mb-4 mt-8 flex justify-between items-center">
        <div className="flex flex-wrap gap-2">
          <span className="text-gray-600 text-sm mr-2 flex items-center">Show Me:</span>
          <button 
            className={`px-4 py-2 rounded-full text-sm ${isSelected('Challenges') ? 'bg-gray-800 text-white' : 'bg-white text-gray-700 border'}`}
            onClick={() => toggleOption('Challenges')}
          >
            Challenges
          </button>
          <button 
            className={`px-4 py-2 rounded-full text-sm ${isSelected('Ideas') ? 'bg-gray-800 text-white' : 'bg-white text-gray-700 border'}`}
            onClick={() => toggleOption('Ideas')}
          >
            Ideas
          </button>
          <button 
            className={`px-4 py-2 rounded-full text-sm ${isSelected('Idea Spaces') ? 'bg-gray-800 text-white' : 'bg-white text-gray-700 border'}`}
            onClick={() => toggleOption('Idea Spaces')}
          >
            Idea Spaces
          </button>
        </div>
        <div className="flex items-center space-x-4">
        <div className="relative">
  <form onSubmit={handleSearchSubmit}>
    <input
      type="text"
      placeholder="Looking for Something?"
      value={searchQuery}
      onChange={handleSearchChange}
      className="border rounded-lg px-4 py-2 pr-10 text-sm w-64"
    />
    <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
      <Search className="text-gray-500 w-5 h-5" />
    </button>
  </form>
</div>

          <div className="flex items-center space-x-2">
            <span className="text-gray-600 text-sm">Sort By:</span>
            <select onChange={handleSortChange} className="border rounded-full px-2 py-1 text-sm">
  <option value="date">Date</option>
  <option value="popularity">Popularity</option>
</select>

          </div>
          <button 
            className="text-purple-600 text-sm font-medium flex items-center"
            onClick={toggleFilter}
          >
            Filter
            <Filter className="ml-1 w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {challenges.map((challenge) => (
          <ChallengeCard
            key={challenge._id}
            challenge={challenge}
            onChallengeDeleted={handleChallengeDeleted}
            onChallengeArchived={handleChallengeArchived}
          />
        ))}
      </div>

      <footer className="mt-8 text-center text-gray-500 text-sm">
        Wondry © 2024
      </footer>

      <Transition appear show={isFilterOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-10" onClose={toggleFilter}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-medium leading-6 text-gray-900 text-center mb-8"
                  >
                    Filter
                  </Dialog.Title>
                  <button
                    type="button"
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                    onClick={toggleFilter}
                  >
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                  
                  <div className="mt-4 space-y-8">
                    <div className="flex flex-wrap gap-6">
                      {['myContent', 'followedContent', 'myEvaluations', 'archived'].map((option) => (
                        <label key={option} className="inline-flex items-center">
                          <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-purple-600 rounded"
                            checked={filterOptions[option]}
                            onChange={(e) => handleFilterChange(option, e.target.checked)}
                          />
                          <span className="ml-3 text-gray-700">
                            {option.charAt(0).toUpperCase() + option.slice(1).replace(/([A-Z])/g, ' $1')}
                          </span>
                        </label>
                      ))}
                    </div>

                    <div className="space-y-6">
                      {['category', 'status'].map((field) => (
                        <div key={field} className="flex items-center">
                          <label className="w-32 text-gray-700 font-medium">{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                          <div className="relative flex-1">
                            <select
                              className="w-full p-3 border rounded-lg appearance-none bg-white"
                              value={filterOptions[field]}
                              onChange={(e) => handleFilterChange(field, e.target.value)}
                            >
                              <option value={filterOptions[field]}>{filterOptions[field]}</option>
                              {/* Add more options as needed */}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          </div>
                        </div>
                      ))}

                      <div className="flex items-center">
                        <label className="w-32 text-gray-700 font-medium">Publish Date:</label>
                        <div className="flex-1 flex items-center space-x-4">
                          <input
                            type="date"
                            className="flex-1 p-3 border rounded-lg bg-white"
                            value={filterOptions.publishDateFrom}
                            onChange={(e) => handleFilterChange('publishDateFrom', e.target.value)}
                          />
                          <span className="text-gray-500">to</span>
                          <input
                            type="date"
                            className="flex-1 p-3 border rounded-lg bg-white"
                            value={filterOptions.publishDateTo}
                            onChange={(e) => handleFilterChange('publishDateTo', e.target.value)}
                          />
                          <Calendar className="text-gray-400" />
                        </div>
                      </div>

                      <div className="flex items-center">
                        <label className="w-32 text-gray-700 font-medium">Keywords:</label>
                        <div className="flex-1 flex flex-wrap gap-2">
                          {filterOptions.keywords.map((keyword) => (
                            <span key={keyword} className="bg-gray-800 text-white px-3 py-1.5 rounded-full text-sm flex items-center">
                              {keyword}
                              <button onClick={() => handleKeywordRemove(keyword)} className="ml-2 focus:outline-none">
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                          <input
                            type="text"
                            className="flex-1 p-3 border rounded-lg"
                            placeholder="Add keyword"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleKeywordAdd(e.target.value);
                                e.target.value = '';
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent bg-purple-600 px-6 py-3 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
                      onClick={toggleFilter}
                    >
                      Search
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <AdminCreateChallengePopup
        isOpen={showCreateChallenge}
        onClose={() => setShowCreateChallenge(false)}
      />
    </div>
  );
};

export default Discover;
