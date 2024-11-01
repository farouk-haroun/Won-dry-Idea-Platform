import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Search, Bell, Menu, Star, Share2, Eye, ArrowLeft, Filter, MessageCircle } from 'lucide-react';
import ProfilePopup from '../components/ProfilePopup';
import ChallengeCard from '../components/ChallengeCard';
import { Dialog, Transition } from '@headlessui/react';
import { Calendar, ChevronDown, X } from 'lucide-react';

const IdeaSpace = () => {
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [showType, setShowType] = useState('Challenges');
  const navigate = useNavigate();
  const { topic } = useParams();

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
  const [challenges, setChallenges] = useState([]);

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
    navigate('/login');
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
            <Link to="/" className="text-[#2c2c2c] text-xl">Home</Link>
            <Link to="/discover" className="text-[#2c2c2c] text-xl">Discover</Link>
            <Link to="/analytics" className="text-[#2c2c2c] text-xl">Analytics</Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Search className="text-gray-500 cursor-pointer" />
          <Bell className="text-gray-500 cursor-pointer" />
          <Menu className="text-gray-500 md:hidden cursor-pointer" />
          <div className="relative">
            <div 
              className="w-14 h-14 bg-[#2c2c2c] rounded-full flex items-center justify-center text-white text-xl cursor-pointer"
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

      {/* Idea Space Header */}
      <div 
        className="p-4 h-64 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)',
          backgroundColor: 'rgba(0,0,0,0.5)',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="container mx-auto flex items-start justify-between pt-4">
          <div className="flex items-center space-x-4">
            <button 
              className="p-2 rounded-full hover:bg-white/20 text-white"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-white">Wond'ry {topic?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Studio</h1>
          </div>
          <div className="flex items-center space-x-4">
            {/* <button className="bg-[#4CAF50] text-white px-6 py-2 rounded-full hover:bg-[#45a049]">
              Request Access
            </button> */}
            <button className="p-2 rounded-full hover:bg-white/20 text-white">
              <Star className="w-6 h-6" />
            </button>
            <button className="p-2 rounded-full hover:bg-white/20 text-white">
              <Share2 className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b">
        <div className="container mx-auto">
          <div className="flex space-x-4">
            <button
              className={`px-6 py-3 ${activeTab === 'Overview' ? 'border-b-2 border-[#874c9e] text-[#874c9e]' : 'text-gray-600'}`}
              onClick={() => setActiveTab('Overview')}
            >
              Overview
            </button>
            <button
              className={`px-6 py-3 ${activeTab === 'Activity' ? 'border-b-2 border-[#874c9e] text-[#874c9e]' : 'text-gray-600'}`}
              onClick={() => setActiveTab('Activity')}
            >
              Activity
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'Overview' ? (
        <div className="container mx-auto py-8 px-4">
          {/* Welcome Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Welcome to the Commodore Cup 2023!</h2>
            <p className="text-gray-700 mb-4">
              We are thrilled to announce the inaugural Commodore Cup, a campus-wide design challenge hosted by the Wond'ry,
              Vanderbilt University's Innovation Center. The theme of the 2023 Commodore Cup is sustainability. This year's challenge is
              made possible in collaboration with the Vanderbilt University Division of Administration and Clearloop. Participation is open
              to all Vanderbilt University staff, students, and faculty, who can participate as individuals or teams of up to 4 people. No
              prior sustainability or design experience necessary!
            </p>
            <p className="text-gray-700">
              Participating individuals and teams will submit a design for one of the following design challenge tracks:
            </p>
            <ul className="list-disc list-inside mt-2 ml-4">
              <li>Transportation</li>
              <li>Sustainability Dashboard</li>
            </ul>
          </div>

          {/* Featured Challenge */}
          <div className="mb-12">
            <h2 className="text-[#874c9e] text-2xl font-bold mb-6">Featured Challenge</h2>
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row">
                <img src="https://images.pexels.com/photos/355952/pexels-photo-355952.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Challenge" className="w-full md:w-1/3 rounded-lg mb-6 md:mb-0 md:mr-6" />
                <div className="md:w-2/3">
                <h3 className="text-2xl font-bold mb-4">Idea Innovation Challenge</h3>
                <p className="mb-4">
                    Join our latest challenge to revolutionize the way we interact with AI. Develop innovative solutions that bridge the gap between human creativity and machine intelligence.
                </p>
                <div className="flex items-center mb-4">
                    <span className="mr-2">Stage:</span>
                    <span className="bg-[#b49248] text-white px-3 py-1 rounded-full">Winners Announcement</span>
                </div>
                <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                    <Star className="w-5 h-5 text-[#5653a6] mr-1" />
                    <span className="text-[#5653a6]">34</span>
                    </div>
                    <div className="flex items-center">
                    <Eye className="w-5 h-5 text-[#5653a6] mr-1" />
                    <span className="text-[#5653a6]">23,696</span>
                    </div>
                    <div className="flex items-center">
                    <MessageCircle className="w-5 h-5 text-[#5653a6] mr-1" />
                    <span className="text-[#5653a6]">127</span>
                    </div>
                </div>
                </div>
            </div>
          </div>

          {/* Announcements */}
          <div>
            <h2 className="text-[#874c9e] text-2xl font-bold mb-6">Announcements</h2>
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row">
                <div className="md:w-2/3 pr-6">
                <h3 className="text-2xl font-bold mb-4">Idea Innovation Challenge Winner</h3>
                <p className="mb-6">
                    Congratulations to our latest winner who developed a groundbreaking solution for sustainable urban transportation!
                </p>
                <div className="bg-white rounded-lg shadow p-4 flex items-start">
                    <img src="https://images.pexels.com/photos/355952/pexels-photo-355952.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Winner" className="w-20 h-20 rounded-full mr-4 object-cover" />
                    <div>
                    <h4 className="text-xl font-bold mb-2">Interactive Dashboards</h4>
                    <p className="text-sm mb-2">in Commodore Cup 2023 Challenge</p>
                    <div className="flex items-center mb-4">
                        <span className="mr-2">Author:</span>
                        <span className="bg-[#2c2c2c] text-white px-3 py-1 rounded-full">Mothuso Malunga</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                        <Star className="w-4 h-4 text-[#5653a6] mr-1" />
                        <span className="text-[#5653a6] text-sm">34</span>
                        </div>
                        <div className="flex items-center">
                        <Eye className="w-4 h-4 text-[#5653a6] mr-1" />
                        <span className="text-[#5653a6] text-sm">23,696</span>
                        </div>
                        <div className="flex items-center">
                        <span className="text-yellow-400">★★★☆☆</span>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
                <div className="md:w-1/3 mt-6 md:mt-0">
                <img src="https://images.pexels.com/photos/355952/pexels-photo-355952.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Announcement" className="w-full rounded-lg shadow-lg" />
                </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-16">
          <div className="mb-4 mt-8 flex justify-between items-center">
            <div className="flex flex-wrap gap-2">
              <span className="text-gray-600 text-sm mr-2 flex items-center">Show Me:</span>
              <button 
                className={`px-4 py-2 rounded-full text-sm ${showType === 'Challenges' ? 'bg-gray-800 text-white' : 'bg-white text-gray-700 border'}`}
                onClick={() => setShowType('Challenges')}
              >
                Challenges
              </button>
              <button 
                className={`px-4 py-2 rounded-full text-sm ${showType === 'Ideas' ? 'bg-gray-800 text-white' : 'bg-white text-gray-700 border'}`}
                onClick={() => setShowType('Ideas')}
              >
                Ideas
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

          {/* Filter Dialog - EXACT copy from discover.js */}
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
        </div>
      )}

      <footer className="bg-white py-8 text-center">
        <p className="text-gray-600">Wondry © 2024</p>
      </footer>
    </div>
  );
};

export default IdeaSpace;
