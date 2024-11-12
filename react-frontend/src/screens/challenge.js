// src/screens/challenge.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Star, Share2, Search, Bell, Menu, Plus, Users, X } from 'lucide-react';
import IdeaCard from '../components/IdeaCard';
import ProfilePopup from '../components/ProfilePopup';
import { Dialog, Transition } from '@headlessui/react';
import { API_BASE_URL } from '../utils/constants';
import axios from 'axios';

const Challenge = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const navigate = useNavigate();
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false);
  const [isCreateTeamDialogOpen, setIsCreateTeamDialogOpen] = useState(false);
  const [newTeamData, setNewTeamData] = useState({ name: '', description: '' });
  const [teams, setTeams] = useState([]);
  const [challenge, setChallenge] = useState({
    title: '',
    description: '',
    format: '',
    tracks: [],
    stages: [],
    organizers: [],
    community: { name: '', avatar: '' },
    metrics: null
  });
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching data for challenge:', id);
        
        const [challengeRes, teamsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/challenges/${id}`),
          axios.get(`${API_BASE_URL}/challenges/${id}/teams`)
        ]);
        setChallenge(challengeRes.data);
        setTeams(teamsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error.response || error);
        alert('Error loading challenge data: ' + 
          (error.response?.data?.message || error.message) +
          '\nStatus: ' + error.response?.status +
          '\nEndpoint: ' + error.config?.url);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleLogout = () => {
    navigate('/login');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleJoinChallenge = () => {
    setIsTeamDialogOpen(true);
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/teams`, {
        ...newTeamData,
        challengeId: id
      });
      const teamsRes = await axios.get(`${API_BASE_URL}/challenges/${id}/teams`);
      setTeams(teamsRes.data);
      setIsCreateTeamDialogOpen(false);
      setNewTeamData({ name: '', description: '' });
      alert('Team created successfully');
    } catch (error) {
      console.error('Error creating team:', error);
      alert('Error creating team: ' + error.message);
    }
  };

  const handleJoinTeam = async (teamId) => {
    try {
      await axios.post(`${API_BASE_URL}/teams/${teamId}/join`);
      setIsTeamDialogOpen(false);
      alert('Joined team successfully');
    } catch (error) {
      console.error('Error joining team:', error);
    }
  };

  const renderStages = () => {
    return (challenge.stages || []).map((stage, index) => {
      const isOpen = new Date(stage.deadline) > new Date();
      const submissionsCount = stage.submissions?.length || 0;
      const closedDate = new Date(stage.deadline).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });

      return (
        <div key={index} className={`p-4 rounded-md ${isOpen ? 'bg-green-100' : 'bg-gray-100'}`}>
          <h3 className="font-semibold mb-1">{stage.name}</h3>
          <p className="text-sm text-gray-600">{submissionsCount} Submissions</p>
          <p className="text-sm text-gray-600">
            {isOpen ? 'Open' : `Closed ${closedDate}`}
          </p>
        </div>
      );
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const ideas = [
    { title: "Solar-Powered Campus Shuttles", category: "Transportation", stage: "Final Showcase", author: "Team Green", comments: 15, views: 230, ideas: 3, rating: 4 },
    { title: "AI-Driven Energy Optimization", category: "Sustainability Dashboard", stage: "2nd Round Evaluation", author: "Tech Innovators", comments: 22, views: 180, ideas: 5, rating: 5 },
    { title: "Bike-Sharing Program", category: "Transportation", stage: "1st Evaluation", author: "Eco Riders", comments: 8, views: 120, ideas: 2, rating: 3 },
  ];

  return (
    <div className="bg-white">
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
          <h1 className="text-2xl font-bold flex-grow">{challenge.title}</h1>
          <button 
            className="bg-purple-600 text-white px-4 py-2 rounded-md mr-2"
            onClick={handleJoinChallenge}
          >
            Join Challenge
          </button>
          <button className="border border-gray-300 rounded-full p-2 mr-2">
            <Star className="w-5 h-5" />
          </button>
          <button className="border border-gray-300 rounded-full p-2">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {renderStages()}
        </div>

        <div className="flex mb-8">
          <button 
            className={`px-4 py-2 rounded-md mr-2 ${activeTab === 'overview' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${activeTab === 'ideas' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
            onClick={() => setActiveTab('ideas')}
          >
            Ideas
          </button>
        </div>

        {activeTab === 'overview' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-2">
              <h2 className="text-xl font-bold mb-4">Welcome to {challenge.title}!</h2>
              <p className="mb-4">{challenge.description}</p>
              <p className="mb-4">{challenge.format}</p>
              {challenge.tracks && challenge.tracks.length > 0 && (
                <>
                  <p className="mb-4">Participating individuals and teams will submit a design for one of the following design challenge tracks:</p>
                  <ol className="list-decimal list-inside mb-4">
                    {challenge.tracks.map((track, index) => (
                      <li key={index}>{track}</li>
                    ))}
                  </ol>
                </>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Challenge Organizers</h3>
              <div className="grid grid-cols-2 gap-2 mb-8">
                {(challenge.organizers || []).map((organizer, index) => (
                  <div key={index} className="flex items-center bg-gray-100 rounded-full py-2 px-4">
                    <img 
                      src={organizer.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(organizer.name || '')}`} 
                      alt={organizer.name || 'Organizer'} 
                      className="w-8 h-8 rounded-full mr-2" 
                    />
                    <span className="text-sm">{organizer.name}</span>
                  </div>
                ))}
              </div>
              {challenge.community && (
                <>
                  <h3 className="text-lg font-semibold mb-4">Community</h3>
                  <div className="bg-gray-100 rounded-md p-4 mb-8 text-center">
                    <img 
                      src={challenge.community.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(challenge.community.name || '')}`} 
                      alt={challenge.community.name} 
                      className="w-16 h-16 rounded-full mx-auto mb-2" 
                    />
                    <p>{challenge.community.name}</p>
                  </div>
                </>
              )}
              {challenge.metrics && (
                <>
                  <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{challenge.metrics.views || 0}</p>
                      <p className="text-sm text-gray-600">views</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{challenge.metrics.totalIdeas || 0}</p>
                      <p className="text-sm text-gray-600">total ideas</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{challenge.metrics.activeUsers || 0}</p>
                      <p className="text-sm text-gray-600">active users</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ideas.map((idea, index) => (
              <IdeaCard key={index} {...idea} />
            ))}
          </div>
        )}
      </div>

      <footer className="mt-8 text-center text-gray-500 text-sm pb-4">
        Wondry © 2024
      </footer>

      <Transition appear show={isTeamDialogOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsTeamDialogOpen(false)}>
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
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                    Join a Team
                  </Dialog.Title>
                  <button
                    onClick={() => setIsTeamDialogOpen(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-6 w-6" />
                  </button>

                  <div className="mt-4 space-y-4">
                    {teams.map((team) => (
                      <div key={team._id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{team.name}</h4>
                            <p className="text-sm text-gray-500">{team.description}</p>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <Users className="w-4 h-4 mr-1" />
                              <span>{team.members.length} members</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleJoinTeam(team._id)}
                            className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm"
                          >
                            Join
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => {
                        setIsTeamDialogOpen(false);
                        setIsCreateTeamDialogOpen(true);
                      }}
                      className="w-full flex items-center justify-center space-x-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:text-gray-700 hover:border-gray-400"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Create New Team</span>
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isCreateTeamDialogOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsCreateTeamDialogOpen(false)}>
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
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                    Create New Team
                  </Dialog.Title>
                  <button
                    onClick={() => setIsCreateTeamDialogOpen(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-6 w-6" />
                  </button>

                  <form onSubmit={handleCreateTeam} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Team Name</label>
                      <input
                        type="text"
                        value={newTeamData.name}
                        onChange={(e) => setNewTeamData({ ...newTeamData, name: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        value={newTeamData.description}
                        onChange={(e) => setNewTeamData({ ...newTeamData, description: e.target.value })}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                        required
                      />
                    </div>
                    <div className="mt-4">
                      <button
                        type="submit"
                        className="w-full inline-flex justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
                      >
                        Create Team
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Challenge;
