import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, Menu, Star, MessageCircle, Eye } from 'lucide-react';
import ProfilePopup from '../components/ProfilePopup';
import { useNavigate } from 'react-router-dom';
import IdeaSpaceCard from '../components/IdeaSpaceCard';
import { API_BASE_URL } from '../utils/constants';

const Home = () => {
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [ideaSpaces, setIdeaSpaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [challenges, setChallenges] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch both idea spaces and challenges
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch idea spaces
        const ideaSpacesResponse = await fetch(`${API_BASE_URL}/ideaspaces`);
        const ideaSpacesData = await ideaSpacesResponse.json();
        setIdeaSpaces(ideaSpacesData.ideaSpaces || []);

        // Fetch challenges
        const challengesResponse = await fetch(`${API_BASE_URL}/challenges/challenges`);
        const challengesData = await challengesResponse.json();
        setChallenges(challengesData.slice(0, 3) || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIdeaSpaces([]);
        setChallenges([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    // Implement logout logic here
    // For example: clear local storage, reset auth state, etc.
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
            <Link to="/" className="text-[#874c9e] text-xl font-bold">Home</Link>
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

      {/* Welcome Section */}
      <section className="bg-[#2c2c2c] text-white py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <img src="https://images.pexels.com/photos/355952/pexels-photo-355952.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Welcome" className="w-full md:w-1/2 mb-8 md:mb-0 rounded-lg shadow-lg" />
          <div className="md:w-1/2 md:pl-8">
            <h1 className="text-3xl font-black mb-4">Welcome to the Wond'ry Idea Platform</h1>
            <p className="text-xl leading-7">
              Explore groundbreaking ideas, collaborate with innovators, and shape the future of technology and entrepreneurship.
            </p>
          </div>
        </div>
      </section>

      {/* Jump into Challenges Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#874c9e] mb-8">Jump into some Challenges!</h2>
          {isLoading ? (
            <div className="text-center py-8">Loading challenges...</div>
          ) : challenges.length > 0 ? (
            challenges.map((challenge) => (
              <div key={challenge._id} className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row mb-6">
                <img 
                  src={challenge.thumbnailUrl || "/default-challenge-image.jpg"} 
                  alt={challenge.title} 
                  className="w-full md:w-1/3 rounded-lg mb-6 md:mb-0 md:mr-6 object-cover h-[250px]" 
                />
                <div className="md:w-2/3">
                  <h3 className="text-2xl font-bold mb-4">{challenge.title}</h3>
                  <p className="mb-4">{challenge.description}</p>
                  <div className="flex items-center mb-4">
                    <span className="mr-2">Status:</span>
                    <span className={`px-3 py-1 rounded-full ${
                      challenge.status === 'open' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {challenge.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-[#5653a6] mr-1" />
                      <span className="text-[#5653a6]">{challenge.stars || 0}</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="w-5 h-5 text-[#5653a6] mr-1" />
                      <span className="text-[#5653a6]">{challenge.views || 0}</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="w-5 h-5 text-[#5653a6] mr-1" />
                      <span className="text-[#5653a6]">{challenge.comments || 0}</span>
                    </div>
                  </div>
                  <Link 
                    to={`/challenges/${challenge._id}`}
                    className="mt-4 inline-block bg-[#874c9e] text-white px-6 py-2 rounded-lg hover:bg-[#6e3d83] transition-colors"
                  >
                    View Challenge
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">No challenges available</div>
          )}
        </div>
      </section>

      {/* Discover Groups Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#874c9e] mb-8">
            Discover new groups and join in on exciting challenges!
          </h2>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : ideaSpaces.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {ideaSpaces.map((ideaSpace) => (
                <IdeaSpaceCard key={ideaSpace._id} ideaSpace={ideaSpace} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">No idea spaces found</div>
          )}
        </div>
      </section>

      {/* Announcements Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#874c9e] mb-8">Announcements</h2>
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
      </section>

      {/* Footer */}
      <footer className="bg-white py-8 text-center">
        <p className="text-gray-600">Wondry © 2024</p>
      </footer>
    </div>
  );
};

export default Home;
