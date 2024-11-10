import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, Menu } from 'lucide-react';
import ProfilePopup from '../components/ProfilePopup';

const Idea = () => {
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="bg-white h-screen flex flex-col">
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
              role="button"
              aria-label="Profile"
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

      <div className="flex-1">
        <iframe
          title="Embedded Miro Board"
          src="https://miro.com/app/live-embed/uXjVLagsR90=/?moveToViewport=-1784,-1392,7151,3705&embedId=140779962039"
          frameBorder="0"
          scrolling="no"
          allow="fullscreen; clipboard-read; clipboard-write"
          allowFullScreen
          className="w-full h-full"
        />
      </div>

      <footer className="text-center text-gray-500 text-sm py-2">
        Wondry © 2024
      </footer>
    </div>
  );
};

export default Idea;
