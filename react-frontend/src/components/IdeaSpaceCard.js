import React from 'react';
import { Star, Users, Flag, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IdeaSpaceCard = ({ ideaSpace }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Convert title to URL-friendly format and navigate
    const urlTitle = ideaSpace.title.toLowerCase().replace(/\s+/g, '-');
    navigate(`/idea-space/${urlTitle}`);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative h-48">
        <div className="absolute inset-0 bg-black/40"></div>
        <img 
          src={ideaSpace.thumbnail} 
          alt={ideaSpace.title}
          className="w-full h-full object-cover"
        />
        <button 
          className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors duration-300"
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click when starring
            // Add your star/favorite logic here
          }}
        >
          <Star className="w-5 h-5 text-white" />
        </button>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-center mb-6">
          {ideaSpace.title}
        </h3>
        
        <div className="grid grid-cols-2 gap-4 justify-center">
          <div className="flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center mb-2">
              <Flag className="w-5 h-5 text-gray-600" />
            </div>
            <p className="font-bold text-center">{ideaSpace.counts?.challenges || 0}</p>
            <p className="text-sm text-gray-600 text-center">challenges</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center mb-2">
              <Lightbulb className="w-5 h-5 text-gray-600" />
            </div>
            <p className="font-bold text-center">{ideaSpace.counts?.ideas || 0}</p>
            <p className="text-sm text-gray-600 text-center">ideas</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaSpaceCard;
