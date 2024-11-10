import React, { useState } from 'react';
import { X, Upload, Plus } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const AdminCreateChallengePopup = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    stages: [{ name: 'Opening Round', until: '2024/09/29' }],
    organizers: [],
    attachments: [],
    description: '',
    thumbnail: null,
    category: 'Social Innovation'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStageRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      stages: prev.stages.filter((_, i) => i !== index)
    }));
  };

  const handleStageAdd = () => {
    setFormData(prev => ({
      ...prev,
      stages: [...prev.stages, { name: '', until: '' }]
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, file]
      }));
    }
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        thumbnail: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'stages' || key === 'organizers') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key === 'attachments') {
          formData[key].forEach(file => {
            formDataToSend.append('attachments', file);
          });
        } else if (key === 'thumbnail' && formData[key]) {
          formDataToSend.append('thumbnail', formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await axios.post(`${API_BASE_URL}/challenges`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.status === 201) {
        onClose();
      }
    } catch (error) {
      console.error('Error creating challenge:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 max-w-5xl w-full mx-4 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-semibold text-center text-purple-600 mb-8">Add Challenge</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="text" name="title" placeholder="Title" required value={formData.title} onChange={handleChange} />
          <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} />
          <textarea name="description" placeholder="Description" required value={formData.description} onChange={handleChange} />
          <input type="file" onChange={handleThumbnailUpload} />
          <button type="submit">Upload Challenge</button>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateChallengePopup;
