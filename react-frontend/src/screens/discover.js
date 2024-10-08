import React, { useState } from 'react';
import { Search, Bell, Menu, Filter } from 'lucide-react';
import IdeaCard from '../components/IdeaCard';

const Discover = () => {
  const [selectedOptions, setSelectedOptions] = useState(['Challenges']);
  const isSelected = (option) => selectedOptions.includes(option);

  const toggleOption = (option) => {
    setSelectedOptions(prevSelected => {
      if (prevSelected.includes(option)) {
        // If this is the only selected option, don't remove it
        if (prevSelected.length === 1) return prevSelected;
        // Otherwise, remove it
        return prevSelected.filter(item => item !== option);
      } else {
        // Add the option
        return [...prevSelected, option];
      }
    });
  };

  return (
    <div className="bg-white p-16">
      <header className="flex items-center justify-between mb-4">
        <img src="/main_logo.svg" alt="Wondry Logo" className="h-12" />
        
        <nav className="hidden md:flex space-x-6 flex-grow justify-center">
          <a href="#" className="text-gray-700">Home</a>
          <a href="#" className="text-purple-600 font-semibold">Discover</a>
          <a href="#" className="text-gray-700">Analytics</a>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Search className="text-gray-500 cursor-pointer" />
          <Bell className="text-gray-500 cursor-pointer" />
          <Menu className="text-gray-500 md:hidden cursor-pointer" />
          <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white">
            MM
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
          <button className="text-purple-600 text-sm font-medium flex items-center">
            Filter
            <Filter className="ml-1 w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <IdeaCard
          title="Idea Innovation Challenge"
          category="in Social Innovation"
          stage="Winners Announcement"
          comments={34}
          views={23696}
          ideas={127}
        />
        <IdeaCard
          title="Interactive Dashboards"
          category="in Commodore Cup 2023 Challenge"
          author="Mothuso Malunga"
          comments={34}
          views={23696}
          rating={3}
        />
        <IdeaCard
          title="Wond'ry Quantum Studio"
          members={521}
          challenges={521}
          ideas={521}
        />
      </div>

      <footer className="mt-8 text-center text-gray-500 text-sm">
        Wondry © 2024
      </footer>
    </div>
  );
};

export default Discover;