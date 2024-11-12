import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MessageCircle, Eye, Trash2, Archive } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const ChallengeCard = ({ challenge, onChallengeDeleted, onChallengeArchived }) => {
  const { _id, title, description, status, stages, thumbnailUrl } = challenge;
  const submissions = stages?.reduce((sum, stage) => sum + (stage.submissions?.length || 0), 0) || 0;
  const [views, setViews] = useState(challenge.viewCounts || 0);
  const [isArchived, setIsArchived] = useState(status === 'archived');

  // Delete challenge function
  const deleteChallenge = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/challenges/${_id}`);
      onChallengeDeleted(_id); // Callback to update parent component state after deletion
    } catch (error) {
      console.error('Error deleting challenge:', error);
    }
  };

  // Archive challenge function
  const archiveChallenge = async () => {
    try {
      await axios.patch(`${API_BASE_URL}/challenges/${_id}/archive`);
      setIsArchived(true); // Update local state to reflect archived status
      if (onChallengeArchived) onChallengeArchived(_id); // Call the callback if provided
    } catch (error) {
      console.error('Error archiving challenge:', error);
    }
  };

  const incrementViewCount = async () => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/challenges/${_id}/view`);
      setViews(response.data); // Update view count in the UI
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  return (
    <Link
      to={`/challenge/${_id}`}
      state={{ challenge }}
      onClick={incrementViewCount} // Increment view count on click
      className="block"
    >
      <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
        <div className="relative">
          <img
            src={thumbnailUrl || "https://images.pexels.com/photos/355952/pexels-photo-355952.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}
            alt="Challenge"
            className="w-full h-[256px] object-cover"
          />
          <button className="absolute top-2 right-2 bg-white rounded-full p-1 shadow w-12 h-12 flex items-center justify-center">
            <Star className="text-gray-400 w-5 h-5" />
          </button>
        </div>
        <div className="p-4 text-left">
          <h3 className="font-bold text-lg mb-1">{title}</h3>
          <p className="text-sm text-gray-600 mb-2">{description}</p>
          <span
            className={`inline-block text-xs px-2 py-1 rounded-full mb-2 ${
              status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {status === 'open' ? 'Open' : 'Closed'}
          </span>
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <MessageCircle className="w-4 h-4 mr-1" /> {submissions}
              </span>
              <span className="flex items-center">
                <Eye className="w-4 h-4 mr-1" /> {views} {/* Display actual view count */}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {/* Delete Button */}
              <button onClick={deleteChallenge} className="text-red-500 hover:text-red-700">
                <Trash2 className="w-5 h-5" />
              </button>

              {/* Archive Button */}
              {!isArchived && (
                <button onClick={archiveChallenge} className="text-yellow-500 hover:text-yellow-700">
                  <Archive className="w-5 h-5" />
                </button>
              )}
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
