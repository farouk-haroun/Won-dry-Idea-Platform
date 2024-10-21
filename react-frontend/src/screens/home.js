import React from 'react';
import { Search, Bell, Menu, Star, MessageCircle, Eye } from 'lucide-react';

const Home = () => {
  return (
    <div className="bg-[#fdfbf6] min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white">
        <div className="flex items-center">
          <img src="/main_logo.svg" alt="Wondry Logo" className="h-12 mr-4" />
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-[#874c9e] text-xl font-bold">Home</a>
            <a href="#" className="text-[#2c2c2c] text-xl">Discover</a>
            <a href="#" className="text-[#2c2c2c] text-xl">Analytics</a>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Search className="text-gray-500 cursor-pointer" />
          <Bell className="text-gray-500 cursor-pointer" />
          <Menu className="text-gray-500 md:hidden cursor-pointer" />
          <div className="w-14 h-14 bg-[#2c2c2c] rounded-full flex items-center justify-center text-white text-xl">
            MM
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <section className="bg-[#2c2c2c] text-white py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <img src="https://via.placeholder.com/562x354" alt="Welcome" className="w-full md:w-1/2 mb-8 md:mb-0" />
          <div className="md:w-1/2 md:pl-8">
            <h1 className="text-3xl font-black mb-4">Welcome to the Wond'ry Idea Platform</h1>
            <p className="text-xl leading-7">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Donec vehicula, erat sed vulputate vestibulum, metus sem laoreet
              non rutrum nulla massa et diam. Donec imperdiet lobortis magna, 
              vitae gravida dui efficitur eget. Vivamus vel lectus placerat nulla 
              pellentesque porta ac eu lorem. Pellentesque pulvinar bibendum  
              et condimentum.
            </p>
          </div>
        </div>
      </section>

      {/* Jump into Challenges Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#874c9e] mb-8">Jump into some Challenges!</h2>
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row">
            <img src="https://via.placeholder.com/438x265" alt="Challenge" className="w-full md:w-1/3 rounded-lg mb-6 md:mb-0 md:mr-6" />
            <div className="md:w-2/3">
              <h3 className="text-2xl font-bold mb-4">Idea Innovation Challenge</h3>
              <p className="mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Donec vehicula, erat sed vulputate vestibulum, metus sem laoreet quam,
                non rutrum nulla massa et diam. Donec imperdiet lobortis magna,
                vitae gravida dui efficitur eget. Vivamus vel lectus placerat nulla
                pellentesque porta ac eu lorem. Pellentesque pulvinar bibendum turpis
                et condimentum.
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
      </section>

      {/* Discover Groups Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#874c9e] mb-8">Discover new groups and join in on exciting challenges!</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4">
                <img src="https://via.placeholder.com/276x210" alt="Group" className="w-full rounded-lg mb-4" />
                <h3 className="text-xl font-bold text-center mb-4">Wond'ry Quantum Studio</h3>
                <div className="flex justify-between">
                  <div className="text-center">
                    <p className="font-bold">521</p>
                    <p className="text-sm">members</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold">521</p>
                    <p className="text-sm">challenges</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold">521</p>
                    <p className="text-sm">ideas</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vehicula, erat
                sed vulputate vestibulum, metus sem laoreet quam,
                non rutrum nulla massa et diam. Donec imperdiet lobortis magna,
                vitae gravida dui efficitur eget.
              </p>
              <div className="bg-white rounded-lg shadow p-4 flex items-start">
                <img src="https://via.placeholder.com/84x84" alt="Winner" className="w-20 h-20 rounded-full mr-4" />
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
              <img src="https://via.placeholder.com/461x447" alt="Announcement" className="w-full rounded-lg" />
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

