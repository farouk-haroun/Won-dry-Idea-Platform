import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Star, Share2, Search, Bell, Menu } from 'lucide-react';

const Challenge = () => {
  // Test data
  const challenge = {
    title: "Commodore Cup 2023 Sustainability Challenge",
    stages: [
      { name: "1st Evaluation", status: "closed", ideasCount: 0, closedDate: "29 Apr 2023" },
      { name: "2nd Round Evaluation", status: "closed", ideasCount: 0, closedDate: "29 Apr 2023" },
      { name: "Final Showcase", status: "closed", ideasCount: 0, closedDate: "29 Apr 2023" },
      { name: "Winners Announcement", status: "open", ideasCount: 0 },
    ],
    description: "We are thrilled to announce the inaugural Commodore Cup, a campus-wide design challenge hosted by the Wond'ry, Vanderbilt University's Innovation Center. The theme of the 2023 Commodore Cup is sustainability. This year's challenge is made possible in collaboration with the Vanderbilt University Division of Administration and Clearloop. Participation is open to all Vanderbilt University staff, students, and faculty, who can participate as individuals or teams of up to 4 people. No prior sustainability or design experience necessary!",
    format: "The challenge has a hybrid format with touch points along the way to support participants through the process of prototyping their solution. Teams will have access to office hours, mentors, and advisors to help them flesh out their design and refine their final submission. We have also partnered with Dores Design so student designers can help bring your ideas to life. The challenge will culminate on November 16th where 5 selected finalists from each of the 2 design tracks will present their ideas in-person to a panel of judges for an opportunity to win cash prizes.",
    tracks: ["Transportation", "Sustainability Dashboard"],
    organizers: [
      { name: "John Doe", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
      { name: "Samantha Pene", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
      { name: "Michael Sybil", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
      { name: "Jane Doe", avatar: "https://randomuser.me/api/portraits/women/4.jpg" },
    ],
    community: {
      name: "Wondry Quantum Studio",
      avatar: "https://randomuser.me/api/portraits/lego/1.jpg"
    },
    metrics: {
      views: 521,
      totalIdeas: 521,
      activeUsers: 521
    }
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
          <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white">
            MM
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <button className="mr-4">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold flex-grow">{challenge.title}</h1>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-md mr-2">Join Challenge</button>
          <button className="border border-gray-300 rounded-full p-2 mr-2">
            <Star className="w-5 h-5" />
          </button>
          <button className="border border-gray-300 rounded-full p-2">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {challenge.stages.map((stage, index) => (
            <div key={index} className={`p-4 rounded-md ${stage.status === 'open' ? 'bg-green-100' : 'bg-gray-100'}`}>
              <h3 className="font-semibold mb-1">{stage.name}</h3>
              <p className="text-sm text-gray-600">{stage.ideasCount} Ideas</p>
              <p className="text-sm text-gray-600">
                {stage.status === 'open' ? 'Open' : `Closed ${stage.closedDate}`}
              </p>
            </div>
          ))}
        </div>

        <div className="flex mb-8">
          <button className="bg-gray-800 text-white px-4 py-2 rounded-md mr-2">Overview</button>
          <button className="bg-white text-gray-800 px-4 py-2 rounded-md">Ideas</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-2">
            <h2 className="text-xl font-bold mb-4">Welcome to the {challenge.title}!</h2>
            <p className="mb-4">{challenge.description}</p>
            <p className="mb-4">{challenge.format}</p>
            <p className="mb-4">Participating individuals and teams will submit a design for one of the following design challenge tracks (see more details on each track under 2023 Challenge Details below):</p>
            <ol className="list-decimal list-inside mb-4">
              {challenge.tracks.map((track, index) => (
                <li key={index}>{track}</li>
              ))}
            </ol>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Challenge Organizers</h3>
            <div className="grid grid-cols-2 gap-2 mb-8">
              {challenge.organizers.map((organizer, index) => (
                <div key={index} className="flex items-center bg-gray-100 rounded-full py-2 px-4">
                  <img src={organizer.avatar} alt={organizer.name} className="w-8 h-8 rounded-full mr-2" />
                  <span className="text-sm">{organizer.name}</span>
                </div>
              ))}
            </div>
            <h3 className="text-lg font-semibold mb-4">Community</h3>
            <div className="bg-gray-100 rounded-md p-4 mb-8 text-center">
              <img src={challenge.community.avatar} alt={challenge.community.name} className="w-16 h-16 rounded-full mx-auto mb-2" />
              <p>{challenge.community.name}</p>
            </div>
            <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{challenge.metrics.views}</p>
                <p className="text-sm text-gray-600">views</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{challenge.metrics.totalIdeas}</p>
                <p className="text-sm text-gray-600">total ideas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{challenge.metrics.activeUsers}</p>
                <p className="text-sm text-gray-600">active users</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-8 text-center text-gray-500 text-sm pb-4">
        Wondry © 2024
      </footer>
    </div>
  );
};

export default Challenge;
