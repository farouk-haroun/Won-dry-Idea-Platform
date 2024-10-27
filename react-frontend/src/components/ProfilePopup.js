import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, User, FileText, File, Settings } from 'lucide-react';

const ProfilePopup = ({ onClose, onLogout }) => {
  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center" onClick={onClose}>
        <User className="mr-2 h-4 w-4" />
        My Profile
      </Link>
      <Link to="/my-content" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center" onClick={onClose}>
        <FileText className="mr-2 h-4 w-4" />
        My Content
      </Link>
      <Link to="/my-drafts" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center" onClick={onClose}>
        <File className="mr-2 h-4 w-4" />
        My Drafts
      </Link>
      <Link to="/account-settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center" onClick={onClose}>
        <Settings className="mr-2 h-4 w-4" />
        Account Settings
      </Link>
      <button onClick={onLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center">
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </button>
    </div>
  );
};

export default ProfilePopup;

