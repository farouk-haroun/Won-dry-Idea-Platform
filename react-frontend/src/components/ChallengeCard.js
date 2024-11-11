import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MessageCircle, Eye } from 'lucide-react';

const ChallengeCard = ({ challenge }) => {
  const { _id, title, description, status, stages, thumbnailUrl, organizers } = challenge;
  const submissions = stages?.reduce((sum, stage) => sum + (stage.submissions?.length || 0), 0) || 0;
  const views = Math.floor(Math.random() * 50000); // TODO: Replace with actual views

  return (
    <Link to={`/challenge/${_id}`} state={{ challenge }} className="block">
      <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
        <div className="relative">
          <img src={thumbnailUrl || "https://images.pexels.com/photos/355952/pexels-photo-355952.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"} alt="Challenge" className="w-full h-[256px] object-cover" />
          <button className="absolute top-2 right-2 bg-white rounded-full p-1 shadow w-12 h-12 flex items-center justify-center">
            <Star className="text-gray-400 w-5 h-5" />
          </button>
        </div>
        <div className="p-4 text-left">
          <h3 className="font-bold text-lg mb-1">{title}</h3>
          <p className="text-sm text-gray-600 mb-2">{description}</p>
          <span className={`inline-block text-xs px-2 py-1 rounded-full mb-2 ${
            status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {status === 'open' ? 'Open' : 'Closed'}
          </span>
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <MessageCircle className="w-4 h-4 mr-1" /> {submissions}
              </span>
              <span className="flex items-center">
                <Eye className="w-4 h-4 mr-1" /> {views}
              </span>
            </div>
            <span className="flex items-center">
              <span className="text-lg mr-1">💡</span> {submissions}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ChallengeCard;
