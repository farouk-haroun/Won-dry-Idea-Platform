import React from 'react';
import { Star, MessageCircle, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IdeaCard = ({ title, category, stage, author, comments, views, ideas, rating }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/challenge_idea');
  };

  return (
    <div 
      className="bg-white border rounded-lg overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleClick}
    >
      <div className="relative">
        <img src="https://images.pexels.com/photos/355952/pexels-photo-355952.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Idea" className="w-full h-[256px] object-cover" />
        <button 
          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow w-12 h-12 flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <Star className="text-gray-400 w-5 h-5" />
        </button>
      </div>
      <div className="p-4 text-left">
        <h3 className="font-bold text-lg mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-2">{category}</p>
        {stage && (
          <>
            <span className="text-xs text-gray-600 mb-1">Stage:</span>
            <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full mb-2">
              {stage}
            </span>
          </>
        )}
        {author && (
          <p className="mb-2">
            <span className="bg-gray-800 text-white text-sm px-2 py-1 rounded-full">{author}</span>
          </p>
        )}
        {(comments !== undefined || views !== undefined || ideas !== undefined) && (
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <div className="flex items-center space-x-4">
              {comments !== undefined && (
                <span className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-1" /> {comments}
                </span>
              )}
              {views !== undefined && (
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" /> {views}
                </span>
              )}
            </div>
            {ideas !== undefined && (
              <span className="flex items-center">
                <span className="text-lg mr-1">💡</span> {ideas}
              </span>
            )}
          </div>
        )}
        {rating && (
          <div className="flex mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IdeaCard;