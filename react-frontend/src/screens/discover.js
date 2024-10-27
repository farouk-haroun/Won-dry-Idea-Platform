import React, { useState, useEffect } from 'react';
import { Search, Bell, Menu, Filter, X, Calendar, ChevronDown } from 'lucide-react';
import ChallengeCard from '../components/ChallengeCard';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { Link, useNavigate } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import ProfilePopup from '../components/ProfilePopup';

const Discover = () => {
  const [selectedOptions, setSelectedOptions] = useState(['Challenges']);
  const [challenges, setChallenges] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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
  const navigate = useNavigate();

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/challenges/challenges`);
      setChallenges(response.data);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
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
            <input
              type="text"
              placeholder="Looking for Something?"
              className="border rounded-lg px-4 py-2 pr-10 text-sm w-64"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 text-sm">Sort By:</span>
            <select className="border rounded-full px-2 py-1 text-sm">
              <option>Relevance</option>
              <option>Date</option>
              <option>Popularity</option>
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 text-center mb-4"
                  >
                    Filter
                  </Dialog.Title>
                  <button
                    type="button"
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-500"
                    onClick={toggleFilter}
                  >
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                  
                  <div className="mt-2 space-y-4">
                    <div className="flex flex-wrap gap-4">
                      {['myContent', 'followedContent', 'myEvaluations', 'archived'].map((option) => (
                        <label key={option} className="inline-flex items-center">
                          <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-purple-600"
                            checked={filterOptions[option]}
                            onChange={(e) => handleFilterChange(option, e.target.checked)}
                          />
                          <span className="ml-2 text-gray-700">
                            {option.charAt(0).toUpperCase() + option.slice(1).replace(/([A-Z])/g, ' $1')}
                          </span>
                        </label>
                      ))}
                    </div>

                    <div className="space-y-2">
                      {['category', 'status'].map((field) => (
                        <div key={field} className="flex items-center">
                          <label className="w-24 text-gray-700">{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                          <div className="relative flex-1">
                            <select
                              className="w-full p-2 border rounded-lg appearance-none"
                              value={filterOptions[field]}
                              onChange={(e) => handleFilterChange(field, e.target.value)}
                            >
                              <option value={filterOptions[field]}>{filterOptions[field]}</option>
                              {/* Add more options as needed */}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          </div>
                        </div>
                      ))}

                      <div className="flex items-center">
                        <label className="w-24 text-gray-700">Publish Date:</label>
                        <div className="flex-1 flex items-center space-x-2">
                          <input
                            type="date"
                            className="flex-1 p-2 border rounded-lg"
                            value={filterOptions.publishDateFrom}
                            onChange={(e) => handleFilterChange('publishDateFrom', e.target.value)}
                          />
                          <span>to</span>
                          <input
                            type="date"
                            className="flex-1 p-2 border rounded-lg"
                            value={filterOptions.publishDateTo}
                            onChange={(e) => handleFilterChange('publishDateTo', e.target.value)}
                          />
                          <Calendar className="text-gray-400" />
                        </div>
                      </div>

                      <div className="flex items-center">
                        <label className="w-24 text-gray-700">Keywords:</label>
                        <div className="flex-1 flex flex-wrap gap-2">
                          {filterOptions.keywords.map((keyword) => (
                            <span key={keyword} className="bg-gray-800 text-white px-2 py-1 rounded-full text-sm flex items-center">
                              {keyword}
                              <button onClick={() => handleKeywordRemove(keyword)} className="ml-1 focus:outline-none">
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                          <input
                            type="text"
                            className="flex-1 p-2 border rounded-lg"
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

                  <div className="mt-4">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
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
    </div>
  );
};

export default Discover;
